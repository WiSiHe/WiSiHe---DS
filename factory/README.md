# Factory runner

A launchd job (every 15 minutes) that starts Claude Code on a ticket without a prompt.

1. Picks the oldest open issue labelled `ready-for-agent` (skips it if there is no "Acceptance criteria" section).
2. Relabels it `agent-working` so no second run takes it.
3. Creates a worktree on `agent/issue-N`, runs `claude -p` with an allow-list (no merge, force-push, reset or checkout).
4. The agent reads AGENTS.md and the ticket, implements it, runs lint/typecheck/test, and opens a PR.
5. The runner waits for CI and a Qodo review newer than the head commit, and feeds findings back. At most 2 fix rounds.
6. Success: label `agent-pr-open`. Stuck or CI still red: label `agent-needs-help` with a comment. It never merges.

```bash
factory/install.sh            # install and start the schedule
factory/install.sh uninstall  # remove it
FACTORY_DRY_RUN=1 zsh factory/run.sh   # show which ticket would be picked
```

Logs: `~/.wisihe-factory/logs/`.
