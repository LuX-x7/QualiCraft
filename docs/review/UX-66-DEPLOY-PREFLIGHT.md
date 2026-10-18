# UX66 · Deployment authorized; credential update still pending

> Superseded publication status: UX67 publishes main through the authorized GitHub connection and manually deploys both existing services. The original authentication failures below remain historical evidence. See [current release, CI and hosted limitation](UX-67-PUBLIC-RELEASE.md).

2026-10-18. The owner explicitly authorized manual deployment of the existing website and read-only Bologna workbench **after successful source push**, keeping automatic deployment off. The owner said they were updating local GitHub authorization; they did not yet report completion. This authorization persists and does not need to be requested again.

## Completed preparation

- Clean `t7-site` candidate was checked at `1a09d700a84be73d4e18b5cf0f4658879d947062`, including tested implementation `787065a388ee3ef82ebe5d76683d9e2e934dd704`. No product changes or repeated functional tests in this documentation-only preflight; UX65's source/build and desktop evidence remain applicable.
- Actual push retry exited 1 with GitHub's same missing `workflow` scope rejection for `.github/workflows/test.yml`. Do not confuse the owner's intended credential update with a completed update of the credential Git actually uses. Raw command/output: `~/qualicraft-review/ux-65/raw/push-after-user-update.*`.
- Existing Render browser login succeeded through the previously used GitHub sign-in. No new repository permissions were granted and no credentials were displayed or copied. Only the project's Render tab was opened; no other windows/tabs were read.
- Website service: `srv-db54d6ivcj2c738dnsk0`, https://qualicraft-website.onrender.com . Current displayed live commit: `31a354fc1c2b94ae323631ee7e847e13799e30a9`.
- Workbench service: `srv-db54cfqvcj2c738dn570`, https://qualicraft-workbench.onrender.com . Current displayed live commit: `0bd451094b9ea3cd1f4113228fc530b32d6ad0f6`. Start command remains `python run_demo.py`.
- Both services currently use the repository's `main` branch. Each Auto-Deploy menu was inspected and showed **Off selected**. Inspection forms were cancelled without saving. `render.yaml`, branches, commands, environment and deployment settings remain unchanged.
- The workbench's Manual Deploy menu exposes **Deploy a specific commit**. No deploy option was selected. Prefer the verified pushed candidate commit, preserving `main`, rather than deploying the old latest main commit or changing repository history.

## Remaining sequence

1. Owner finishes the local Git credential update and reports completion; do not request or accept a token in chat.
2. Retry normal push of `t7-site`; verify its remote full hash and unchanged `main`. Do not force, delete the workflow, or rewrite the audit history to bypass permission checks.
3. Manually deploy the verified candidate commit to the existing read-only workbench, then website. Keep automatic deployment off and preserve the existing public audience and Bologna-only demo configuration.
4. Verify both Render deploys are live at that commit, the website `/report` and new QCA/output markers, `/w` proxy/bootstrap and read-only behavior. Check normal console/HTTP responses and representative exports, then update the supervisor entry and release record.

Manual deployment is **authorized, not executed**. The current blocker is local GitHub authentication. The old public sites must not be presented as the newly deployed UX65 version. Phone follow-up and Windows remain deferred and unverified; prior human/research acceptance decisions are unchanged.
