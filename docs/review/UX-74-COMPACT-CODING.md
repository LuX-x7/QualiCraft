# UX74 · Compact Coding header · 2026-10-19

User requested less header space. Account/sign-out moved into project action row; desktop reading navigation and manual marks share a row at wide viewports; coding path strip shortened. Narrow controls still wrap and retain44px targets. Upload, sign-out, marks, undo, resume, overview and document selector retained. No statistics, plotting, source text, project format or persistence changes.

247 Node regressions and app.js syntax pass. Controlled Chrome uses only QT QA Bologna. At1440×1000, reader top415→286px (129px gain, same expanded state), reading dock141→80px. Initial local129/211 comparison differed due restored scroll; online129px is the accepted comparable result. Keyboard reading-mark focus,390px no page overflow and zero page-script errors pass. Test harness callback initially failed; corrected harness rerun passed, with product unchanged. Evidence `/tmp/qt-compact-node.txt`, `/tmp/qt-compact-browser.txt`, `~/qualicraft-review/ux-74/`.

Only QT app.js/style.css updated; prior files retained in QT/config/web-before-compact-20261019. No service restart or other project writes. Existing known administrator-only boot registration remains pending; not a claim that no defects exist. Windows deferred.

Live unchanged-source verification passes: dock80px, reader top286px, account within project strip, keyboard focus and390px no horizontal overflow, page errors0. The first online readerTop<250 assertion was invalid because local restore had scrolled82px; corrected geometric condition checks the actual dock and preserves raw failure.
