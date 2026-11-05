#!/bin/zsh
# Factory runner: picks ONE issue labelled `ready-for-agent`, has Claude Code
# implement it headless on its own branch, opens a PR, then feeds CI/Qodo
# findings back (max MAX_FIX_ROUNDS). It never merges.
set -u

REPO_SLUG="${FACTORY_REPO:-WiSiHe/WiSiHe---DS}"
REPO_DIR="${FACTORY_REPO_DIR:-$HOME/Developer/Personal/WiSiHe---DS}"
WORK_ROOT="${FACTORY_WORK_ROOT:-$HOME/.wisihe-factory/worktrees}"
LOG_DIR="${FACTORY_LOG_DIR:-$HOME/.wisihe-factory/logs}"
MAX_FIX_ROUNDS="${FACTORY_MAX_FIX_ROUNDS:-2}"
REVIEW_WAIT_SECS="${FACTORY_REVIEW_WAIT_SECS:-600}"
MAX_TURNS="${FACTORY_MAX_TURNS:-60}"
DRY_RUN="${FACTORY_DRY_RUN:-0}"

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
mkdir -p "$WORK_ROOT" "$LOG_DIR"
exec >>"$LOG_DIR/runner.log" 2>&1
log() { print -r -- "[$(date '+%F %T')] $*"; }

# One run at a time (mkdir is an atomic lock on macOS).
LOCK="$WORK_ROOT/.lock"
if ! mkdir "$LOCK" 2>/dev/null; then log "another run in progress, exiting"; exit 0; fi
trap 'rmdir "$LOCK"' EXIT

# Oldest open issue with the trigger label.
ISSUE_JSON=$(gh issue list -R "$REPO_SLUG" --label ready-for-agent --state open \
  --json number,title,body,createdAt --limit 50 | jq 'sort_by(.createdAt) | .[0] // empty')
if [[ -z "$ISSUE_JSON" ]]; then log "no ready-for-agent tickets"; exit 0; fi

N=$(jq -r .number <<<"$ISSUE_JSON")
TITLE=$(jq -r .title <<<"$ISSUE_JSON")
BODY=$(jq -r .body <<<"$ISSUE_JSON")
log "picked #$N: $TITLE"

help_needed() { # $1 = reason
  log "needs help on #$N: $1"
  gh issue edit "$N" -R "$REPO_SLUG" --remove-label agent-working --add-label agent-needs-help >/dev/null
  gh issue comment "$N" -R "$REPO_SLUG" --body "Agent runner stopped: $1. Logs: \`$LOG_DIR\`." >/dev/null
  exit 1
}

# Refuse tickets without acceptance criteria.
if ! grep -qi "acceptance criteria" <<<"$BODY"; then
  gh issue edit "$N" -R "$REPO_SLUG" --remove-label ready-for-agent --add-label agent-needs-help >/dev/null
  gh issue comment "$N" -R "$REPO_SLUG" --body "Agent runner skipped this ticket: no \"Acceptance criteria\" section." >/dev/null
  log "#$N has no acceptance criteria, skipped"; exit 0
fi

if [[ "$DRY_RUN" == "1" ]]; then log "DRY RUN: would work on #$N"; exit 0; fi

# Claim the ticket so no second run takes it.
gh issue edit "$N" -R "$REPO_SLUG" --remove-label ready-for-agent --add-label agent-working >/dev/null

BRANCH="agent/issue-$N"
WT="$WORK_ROOT/issue-$N"
cd "$REPO_DIR" || help_needed "repo dir missing"
git fetch origin main -q || help_needed "git fetch failed"
START_MAIN=$(git rev-parse origin/main)
rm -rf "$WT"; git worktree prune
git worktree add -B "$BRANCH" "$WT" origin/main -q || help_needed "worktree creation failed"
cd "$WT" || help_needed "worktree missing"
(pnpm install --frozen-lockfile && pnpm --filter @wisihe/ui-react build) >"$LOG_DIR/issue-$N-setup.log" 2>&1 \
  || help_needed "pnpm install/build failed (see issue-$N-setup.log)"

# Allow-list: edit files, run pnpm/gh read commands, commit and push ONLY its own branch.
# Merge, force-push, reset and checkout are not on the list.
ALLOWED=(Read Edit Write Glob Grep
  "Bash(pnpm:*)" "Bash(git status:*)" "Bash(git diff:*)" "Bash(git log:*)" "Bash(git add:*)"
  "Bash(git commit:*)" "Bash(git push origin $BRANCH)" "Bash(git push -u origin $BRANCH)"
  "Bash(gh issue view:*)" "Bash(gh pr create:*)" "Bash(gh pr view:*)" "Bash(gh pr checks:*)")
DENIED=("Bash(gh pr merge:*)" "Bash(git push --force:*)" "Bash(git push -f:*)" "Bash(git reset:*)" "Bash(git checkout:*)")

agent() { # $1 = prompt, $2 = log name
  claude -p "$1" --max-turns "$MAX_TURNS" \
    --allowedTools "${ALLOWED[@]}" --disallowedTools "${DENIED[@]}" \
    >"$LOG_DIR/issue-$N-$2.log" 2>&1
}

agent "You are the factory agent for ticket #$N in $REPO_SLUG, working in the current git worktree on branch $BRANCH.
1. Read AGENTS.md and AI_RULES.md, and the .cursor/rules/*.mdc files relevant to your change.
2. Read the ticket with: gh issue view $N -R $REPO_SLUG
3. Implement exactly what the acceptance criteria ask, including the edge case. Add a changeset for user-visible changes.
4. Run pnpm lint && pnpm typecheck && pnpm test and fix failures. Check each acceptance criterion and note how you checked it.
5. Commit, then git push -u origin $BRANCH, then open a PR with gh pr create -R $REPO_SLUG. The PR body must contain: 'Closes #$N', the ticket link, each acceptance criterion with the evidence it is met, and anything you could not verify.
Never merge. Never push to any other branch. If you are stuck, stop and say why." initial \
  || help_needed "agent run failed (see issue-$N-initial.log)"

PR=$(gh pr list -R "$REPO_SLUG" --head "$BRANCH" --json number --jq '.[0].number // empty')
[[ -n "$PR" ]] || help_needed "agent finished without opening a PR"
log "PR #$PR opened"

# Wait for CI, then for a Qodo review newer than the head commit; feed findings back.
for ROUND in $(seq 1 "$MAX_FIX_ROUNDS") final; do
  gh pr checks "$PR" -R "$REPO_SLUG" --watch --interval 30 >"$LOG_DIR/issue-$N-ci-$ROUND.log" 2>&1
  CI_OK=1; gh pr checks "$PR" -R "$REPO_SLUG" >/dev/null 2>&1 || CI_OK=0

  HEAD_TIME=$(gh pr view "$PR" -R "$REPO_SLUG" --json commits --jq '.commits[-1].committedDate')
  QODO=""
  DEADLINE=$(( $(date +%s) + REVIEW_WAIT_SECS ))
  while (( $(date +%s) < DEADLINE )); do
    QODO=$( { gh api "repos/$REPO_SLUG/pulls/$PR/comments" --paginate; gh api "repos/$REPO_SLUG/issues/$PR/comments" --paginate; } \
      | jq -rs --arg t "$HEAD_TIME" 'add | map(select((.user.login|ascii_downcase|test("qodo")) and .created_at > $t)) | map(.body) | join("\n\n---\n\n")')
    [[ -n "$QODO" ]] && break
    sleep 30
  done

  if [[ "$ROUND" == "final" ]]; then break; fi
  if [[ -z "$QODO" && "$CI_OK" == "1" ]]; then log "CI green, no new Qodo findings"; break; fi
  [[ -n "$QODO" ]] || log "no Qodo review within ${REVIEW_WAIT_SECS}s, fixing CI only"

  log "fix round $ROUND (CI_OK=$CI_OK)"
  agent "PR #$PR for ticket #$N has feedback. CI passing: $CI_OK (see: gh pr checks $PR -R $REPO_SLUG).
Qodo review findings:
$QODO

Investigate each finding against the code and the ticket's acceptance criteria. Fix confirmed problems, skip and explain false positives, re-run pnpm lint && pnpm typecheck && pnpm test, commit and git push origin $BRANCH. Never merge." "fix-$ROUND" \
    || help_needed "fix round $ROUND failed (see issue-$N-fix-$ROUND.log)"
done

# Safety: stop if main moved during the run (human may have changed the rules).
git fetch origin main -q
[[ "$(git rev-parse origin/main)" == "$START_MAIN" ]] || log "note: main moved during the run; rebase before merging"

if [[ "$CI_OK" == "1" ]]; then
  gh issue edit "$N" -R "$REPO_SLUG" --remove-label agent-working --add-label agent-pr-open >/dev/null
  log "done: PR #$PR awaiting human review"
else
  help_needed "CI still failing on PR #$PR after $MAX_FIX_ROUNDS fix rounds"
fi
