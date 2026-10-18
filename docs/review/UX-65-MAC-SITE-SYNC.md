# UX65 · Mac capability sync and GitHub review candidate

Date: 2026-10-18. Baseline: `0d4f99f728c2f449366f318394b750b0bac8ac43`.

## Outcome and scope

The website now exposes the implemented workflows where visitors expect them, with concise original procedural drawings and hover/focus/keyboard interactions. The Mac desktop workflow passed a fresh, independent Bologna end-to-end run. No new functional defect was found in those exercised paths. This is a supervisor review candidate, not a claim that every research interpretation or platform has been accepted.

Only website presentation, acceptance tools and review documents changed. No workbench implementation, statistics, plotting, dataset, original SVG/CSV/clip or deployment configuration changed. Screenshots, temporary projects and raw logs remain outside Git.

## What is visible

| Location | Current explanation / interaction |
| --- | --- |
| Import | Multi-file TXT/DOCX queue, progress, retry and explicit duplicate choice; original source/record/range drawing and recording retained. |
| Coding | Exact quote and stable ancestry; manual Read/Revisit/Undo illustration with independent reading/coding tracks; Keep/Resume and role assignment explained. The illustration never changes a project. |
| Analysis | Original saved-path diagram and connected network retained. A separate naturally reached QCA scene explains six generated method steps, supporting hover/focus, arrows and Home/End. |
| Methods | All three methods remain distinct, each with its generated six-step M1. Comparative QCA is the implemented binary, conservative slice: up to 100 cases, 1–6 conditions, one outcome, no logical remainders or fuzzy sets. No fake memberships or results appear in the drawing. |
| Export | Four previews: coded full-text notebook; one Research report with selected method/M1, Analysis Table and Narrative Analysis; five figure types with counts/code; project JSON recovery. Original six format explanations and all five recordings remain accessible. |

The notebook preview uses the actual Bologna source excerpt `[26013,26090)` and its saved three-node path. Its ancestor roles are unspecified in the original dataset, so the drawing says Group / role unassigned. Assigned Theme/Category/Code labels are supported by the actual export; Word edits remain in Word.

The website `/report` remains the fixed 19-document / 874-coding descriptive example. The isolated technical workbench has 21 documents and 876 codings after deliberate test imports and overlapping annotations. QCA memberships in the workbench audit are explicitly known-answer test designations, not empirical Bologna findings. A bound Comparative result belongs inside the chosen Research report, rather than requiring a second competing report.

## Verification and raw evidence

Raw files and screenshots: `~/qualicraft-review/ux-65/` (prepared initially in `/tmp/qualicraft-ux65/`). Each raw log has a command JSON and an exit-code file.

| Command / log stem | Result |
| --- | --- |
| `python -m unittest discover -s tests -v` (`python-tests-authorized`) | 287 tests; OK, 3 existing skips. |
| `node --test tests/*.test.mjs` (`node-tests`) | 225 actually executed tests; all passed. The previous historical 246 count is not relabelled as this run. |
| `node --check web/app.js` (`syntax`) | Exit 0. |
| Package build script's exact `next build` command (`build-release`) | Exit 0; final isolated production build. npm is unavailable in the host runtime, so Node invokes the installed Next CLI directly, as in UX63. |
| `tools/e2e/final_joint.py --desktop-only --out .../joint --site-build .../site-build --port 52773` (`final-joint`) | 13/13, fresh seed, no inherited checks, no diagnostic recovery; console/HTTP/external errors 0. |
| `tools/site/current_outputs_acceptance.py` (`website-current-final`) | 6/6: QCA, real hover without clicks, keyboard, manual reading illustration, four output previews, reduced motion, 720px height and retained assets. |
| `tools/site/story_acceptance.py` (`website-story-final`) | 10/10: native sticky scroll through all 11 scenes, preserved networks, exact source, five plots and all 594 CSV rows. Responsive emulation is not physical-device acceptance. |
| `tools/site/w03_acceptance.py` (`website-original-formats`) | 7/7: old drawings, six old formats, recordings/stills, labels and console. |
| Forbidden-phrase source grep (`text-scan`) | Exit 1, no matches; source directories explicitly recorded. |
| Scope (`scope.json`) | 71 protected files unchanged; 66 final build sources exactly match checkout. |

Desktop order: batch import and duplicate cancellation → exact leaf Enter / overlapping coding / explicit roles → Read/Revisit/Undo / dual tracks / Keep and Resume → filters / jumps / actual reading advance → source-network roundtrip → five actual figures and all 25 package members → count oracles → known-answer QCA calibration/frozen result/code → three method-specific reports, editable Word/ZIP and version restore → full-text Notebook and original exports → normal JSON restore plus committed snapshot copy → website CSV-linked readings and M1.

The test-generated Word packages contain the expected editable native document data; the Word styling/export implementation is unchanged. UX63's rendered-page visual evidence remains valid for that unchanged implementation; no fresh Word-page rendering is claimed here.

## Retained failures and corrections

- First unit run: 49 errors from sandbox-denied local port binding, exit 1. Re-run with local-test permission passes; original log retained.
- First build launch: npm executable unavailable, exit 127. First direct Next attempt: Turbopack refuses a node_modules symlink outside the build root, exit 1. Copying existing installed dependencies into the isolated root resolves the setup problem; final build passes. No product workaround added.
- Initial old story audit still assumed ten scenes and network → plotting paging. It correctly failed after the added QCA scene. Expected scene count/order and actual PageDown traversal now include QCA; the final whole audit passes. Failure output retained.

## Review and remaining acceptance

Start http://127.0.0.1:52774/ and continue to `/w/?lang=en`, project **Bologna · Mac release review**. This is a separate editable public Bologna copy, not the researcher's original project. Other review entries and recovery points are preserved.

User has deferred physical-phone follow-up and Windows; neither is passed. Mac native VoiceOver, actual OS motion setting and browser/OS download-completion feedback still have no new human sign-off. Automated reduced-motion and actual file download/recovery checks pass, and should not be described as those manual checks. Optional external model-provider operation is not claimed without a configured service. Researcher comparison/F07–F08 adjudication and supervisor visual/content acceptance are still human decisions, not software defects silently closed here.

## Remote publication

This user turn authorizes pushing the checked candidate to the existing `LuX-x7/QualiCraft` repository. Preserve visibility and `main`; use the existing local review branch `t7-site`, no force push, no merge, no release creation. The old credential workflow-scope failure is a known prerequisite; the actual attempt will be recorded separately.

Read-only remote checks show `main` at `56581781d20f687955a4cae2ef3c7d331dbbee8e` and no remote `t7-site`. The existing public homepage returned HTTP200 without the new `story-qca` / final-output guide markers; its health endpoint and separate workbench timed out in this bounded check. This is not proof of permanent outage. Source push alone cannot update the site because both autoDeployTrigger settings stay off. Do not present that old URL as the new deployed version. Deployment needs explicit authorization and access, then verification of the final commit on both website and read-only workbench.


## Actual push result · UX65R

The tested implementation is committed locally as `787065a388ee3ef82ebe5d76683d9e2e934dd704`. Actual `git push --porcelain origin HEAD:refs/heads/t7-site` exited 1. GitHub rejected it because the current Personal Access Token lacks `workflow` scope for `.github/workflows/test.yml` in the pending history. This is a GitHub server rejection, not a successful push and not a test failure. No force push, history rewrite, workflow deletion, main update, repository visibility change or deployment was performed. `raw/push.txt`, `raw/push.command.json` and `raw/remote-after.txt` retain the result. The remote review branch remains absent and main keeps its previously checked hash.

User input requested: update local Git credentials with workflow permission (never send the token in chat), and explicitly confirm whether to manually deploy both existing services after source push. Keep automatic deployment off. The existing public homepage responds but has no new QCA/output markers, so only the local 52774 entry is verified as this version. Physical phone and Windows remain deferred. The software candidate and review materials are complete for the requested local scope; remote publication is blocked by authentication and deployment approval/access.
