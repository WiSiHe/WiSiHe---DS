---
name: verify-image-srcset
description: Verify that Sanity images in the tanstack-start-portfolio app carry a responsive srcset whose w descriptors match the width the CDN really delivers. Use when a change adds or edits srcSet on an Image call site (ticket #112 slices) or when asked to check image widths on a page.
---

# Verify image srcSet

Checks the rendered page, not the source: every `srcset` candidate is downloaded and its real pixel width must equal its `w` descriptor (ticket #112 rule: "each `w` descriptor must equal the width Sanity actually delivers").

## Inputs

- The page path(s) the change touches, for example `/projects/3d-black-hole`. Ask if the user did not name one.
- The git commit under test (`git rev-parse HEAD`).
- A dev server for `apps/tanstack-start-portfolio` running from this checkout on `http://localhost:1992` (`pnpm --filter tanstack-start-portfolio dev`). Never start it from inside the package directory.
- A folder for evidence files (create it with `mkdir -p`). Use the one the user names, otherwise `$TMPDIR/verify-image-srcset`. Never write evidence into the repo.

## Stop and ask the user when

- Nothing answers on `http://localhost:1992`, or the server runs from a different checkout than the one under test. Check with `lsof -nP -iTCP:1992 -sTCP:LISTEN -t | xargs -I{} lsof -a -p {} -d cwd -Fn 2>/dev/null`: the printed path must start with this checkout's root (the server runs in its `apps/tanstack-start-portfolio` subfolder).
- The page returns a non-200 status, or has no `cdn.sanity.io` image at all (the CMS data or `.env.local` is missing).
- The page path is unknown, or `curl -s -o /dev/null -w '%{http_code}' <url>` does not return 200.
- No component test sits next to the call site you found in step 3. Say so; do not skip the test.

Do not guess a page and do not mark the check passed in these cases.

## Steps

1. Record `git rev-parse --short HEAD`.
2. Run the check on each page and keep the output (no pipe, so the exit code survives):
   `node .claude/skills/verify-image-srcset/scripts/check-srcset.mjs http://localhost:1992<path> --out <evidence-dir>/<name>.json > <evidence-dir>/<name>.txt; echo exit=$?`
   Print the `.txt` file. It lists PASS / FAIL / UNSUPPORTED per candidate (UNSUPPORTED = the width could not be read, so it was not verified) and MISSING for Sanity images without a srcset. Exit 1 means something is not PASS. Exit 2 means nothing was checked (server unreachable, page not 200, or no Sanity image on it): stop and ask. The summary line splits "wrong or missing" from "unreadable and not verified"; report both, and never count unreadable as a pass. A MISSING line is a FAILED check (the call site has no srcset yet), not a stop: report it and continue with step 3.
3. Find the call site and its test:
   Open the route file for the page under `apps/tanstack-start-portfolio/src/routes/` to find the component it renders, then run the test file next to that component. (`grep -rln "srcSet=" apps/tanstack-start-portfolio/src/components` lists the components that already set a srcSet; the rendered component missing from it is itself a finding.) If there is no test file next to it, or it has no URL builder to mutate, stop at this step, mark the check FAILED with that reason, and skip step 4:
   `pnpm --filter tanstack-start-portfolio exec vp test run <path/to/Component.test.tsx>`
4. Mutation check (AGENTS.md rule 6). First run `git diff --quiet -- <file>`; if the component file already has uncommitted changes, stop and ask, because the revert below would discard them. In that component, change the width passed to the URL builder so the delivered width no longer matches, for example `imageUrl(source, width)` to `imageUrl(source, width - 100)`. Do not edit the width list: that changes descriptor and URL together and nothing fails. Wait 3 seconds for the dev server to pick up the edit, rerun step 2 (new file names) and the step 3 test, and confirm both report the failure. Revert with `git checkout -- <file>`, confirm `git diff` is empty, and confirm both pass again.

## Expected result

All candidates PASS with `delivered` equal to the descriptor, no MISSING lines, the component test passes, and the mutated run fails. A page that only shows "has a srcset" is not a pass.

## Evidence to save

If the run stops early or fails, save what you have (the clean-run `.txt` and `.json`) and state the stopping step.

- Commit hash and page URL(s).
- The script's full output (`.txt`) and the JSON file for the clean run, the mutated run and the reverted run.
- The mutation: the line changed and the failing output.
- Put a short summary of these in the PR description.
