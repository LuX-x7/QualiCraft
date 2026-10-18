# UX67 · main publication and existing-service deployment

18 October 2026. The owner explicitly requested **direct publication to main** and had already authorized manual deployment of the existing website and read-only Bologna workbench, with automatic deployment remaining off. This supersedes the earlier branch-only / no-deploy instructions for this release. Only public Bologna material is involved.

## Published source and running application

- Repository: https://github.com/LuX-x7/QualiCraft/tree/main ; visibility unchanged.
- Previous main: `56581781d20f687955a4cae2ef3c7d331dbbee8e`.
- Application release: `98717a66225c18fed65c06fc2f37a13d2bf0dbe0` (includes website implementation `787065a388ee3ef82ebe5d76683d9e2e934dd704`). Main was verified as an ancestor, then advanced without force; the original review history is preserved. Remote `t7-site` also points to this application release.
- CI follow-up: `51f5c67ab657fbbe6a6e301470c78883b2f2f75c`. The only application-release-to-follow-up change is two YAML lines installing the locked website dependencies before the independent report-model Node tests. No source, tests, statistics, plot renderer, data or auto-deploy configuration was changed by that follow-up.
- Local Git credentials still lack workflow scope. The connected GitHub plugin authenticated as HaijunChe with existing collaborator write permission and completed publication. No token was requested, copied, exposed or installed; no workflow was removed and no history was rewritten to work around the rejected local credential.
- Release-status documentation is a later metadata-only commit. The live application remains at the exact release hash above; CI/documentation changes do not require a second application deployment. Final remote refs are retained in the evidence receipt.

| Existing service | Public entry | Verified Render deployment | Application source |
| --- | --- | --- | --- |
| Website `srv-db54d6ivcj2c738dnsk0` | https://qualicraft-website.onrender.com/ | `dep-dbaf5bjrjlhs73a1ijn0` · Deploy succeeded / Live | `98717a66225c18fed65c06fc2f37a13d2bf0dbe0` |
| Workbench `srv-db54cfqvcj2c738dn570` | https://qualicraft-workbench.onrender.com/w/?lang=en | `dep-dbaf4vmq1p3s73behed0` · Deploy succeeded / Live | `98717a66225c18fed65c06fc2f37a13d2bf0dbe0` |

The preferred workbench entry is the website proxy: https://qualicraft-website.onrender.com/w?lang=en . The report is https://qualicraft-website.onrender.com/report . Both Render services retain their existing main-branch settings and **Auto-Deploy Off**. Inspection forms were cancelled without saving. Manual deployment selected the exact release commit, first the workbench, then the website. No paid-plan, instance, environment, start-command, access or audience changes were made.

## Verification and retained failures

Raw commands, exit codes, public HTTP results, GitHub job logs and screenshots are in `~/qualicraft-review/ux-67/`. Automated acceptance scripts are included there; they do not alter project data. Render and public UI checks used only dedicated project tabs.

| Check | Result / evidence |
| --- | --- |
| Full Linux CI | [Run 39145212040](https://github.com/LuX-x7/QualiCraft/actions/runs/39145212040), completed **success** at the CI follow-up hash; `raw/ci-final-status.*` |
| Both Python collection commands | `python -m unittest discover -s tests -v` and `python -m unittest discover -s tests -t . -v`: each **287 tests, OK, 3 existing skips**; `ci-success-python-node.txt` |
| Full Node CI scope | `node --test tests/*.test.mjs tools/report/*.test.mjs`: **246/246**, no failures; same CI log and local `raw/node-ci-scope.*` |
| JavaScript syntax / website production build | `node --check web/app.js`, `npm ci`, `npm run build`: success in CI; `ci-success-python-node.txt`, `ci-success-website.txt`. Render also built the deployed website successfully. Existing Next deprecation warnings remain non-blocking. |
| Public pages | `/`, `/report`, `/about`, `/api/health` return 200; current homepage QCA / output / batch markers and three-method report text present. |
| Original report assets | All **10 SVG/CSV files** match the local manifest hashes; **594 CSV rows** retained. No asset regeneration or data change. |
| Public workbench / proxy | Both current bootstrap routes succeed with one public Bologna project; **19 documents, 317 codes, 874 codings**. `app.js`, `style.css` and `report-editor.js` match published source bytes. |
| Read-only boundary | Empty POST to a deliberately nonexistent API route returns **403** before dispatch. It cannot edit a project even if the guard fails. `public-workbench.json`, `raw/public-workbench.*`. |
| Exports | Public JSON, coding CSV, matrix, methods, coded HTML and native editable DOCX succeed. DOCX ZIP integrity and frozen full text checked. Frequency, coverage, co-occurrence and accumulation each return a valid five-member SVG/PDF/PNG/CSV/Python bundle. The completed public HTTP audit records **19 passed / 1 failed**: the complete hierarchy bundle failure is retained individually in `public-site.json`. A successful audit-command exit means the evidence was recorded, not that all checks passed. |
| Live browser | Homepage, QCA procedure keyboard selection, full-text Notebook preview, Research report preview, report frequency **23** → Enter → matching CSV row, public read-only Coding UI verified. **0 captured console errors** on these browser paths. `browser-live-verification.json`, `live-console-errors.json`, screenshots. |
| Existing local full-flow acceptance | UX65 desktop **13/13**, website **23/23** remain applicable to identical application sources. UX63's Word page-render evidence remains applicable to the unchanged generator; this release does not claim a fresh Word rendering or native OS accessibility test. |

The original main CI run [39144703687](https://github.com/LuX-x7/QualiCraft/actions/runs/39144703687) failed: the Python job ran the report tests without installing TypeScript, so two files could not load. Python and website jobs' relevant steps had passed. `ci-original-failure-excerpt.txt` preserves the 225-pass / two-module-failure result. Installing locked website dependencies in that job fixes the environment; no tests were removed, weakened or skipped. The historical local `-t .` collection problem remains recorded in earlier rounds; the actual Linux CI commands both pass here. No test-entry change was made.

## Remaining issue UX67-01 · hosted full hierarchy export

**Open, hosting capacity.** A real public GET for the default complete hierarchy bundle returned **HTTP 502**. Render Events reports **“Ran out of memory (used over 512MB)”** at 19:29 GMT+3, followed by recovery at 19:30. The parent service restarted. Evidence: `raw/public-site.txt`, `render-memory-limit.png` and `browser-live-verification.json`. This is not an all-green online export acceptance.

The website's original full hierarchy SVG and CSV are intact and downloadable; the current local full workflow and reproducible figure package passed. For the supervisor demonstration, use the website report for the full existing hierarchy and the local editable workbench for its complete new export. Free hosting also has a documented cold-start delay. A paid capacity change needs an explicit spending decision; renderer changes would be a separate authorized task. Neither was made in this release, and the failure is not hidden by silently limiting codes or changing defaults.

## Review entry and scope of acceptance

The public website and report are ready for supervisor visual/content review. The online workbench is intentionally read-only; it cannot demonstrate uploads, saved coding edits or new saved QCA/report runs. Use the existing isolated local **Bologna · Mac release review** at http://127.0.0.1:52774/w/?lang=en for those editable steps. Its 21 documents include technical imports; the fixed public corpus and website report retain 19. Do not confuse the public demo with the normal local application.

Comparative QCA remains the explicitly bounded binary, conservative implementation (1–6 conditions, up to 100 cases); memberships require research justification. Research report is the overall editable synthesis with its selected method and M1 process map. A frozen QCA report is additional method-specific technical evidence. The coded Notebook is the full-text evidence document. These outputs and website explanations are now published together; they are not proof of empirical researcher agreement.

Phone follow-up and Windows remain deferred and unverified. Current native VoiceOver, real system reduced-motion and browser/OS download-completion feedback do not have new human sign-off. Optional external model-provider operation and researcher/supervisor interpretation decisions remain separate. Earlier historical tests and human responses are not re-labelled as current blanket acceptance. See [one-page supervisor guide](SUPERVISOR-ONE-PAGE.md) and [overall plan](EXPERIENCE-ROADMAP.md).
