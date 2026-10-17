# QT · Supervisor review — 17 October 2026

**Current status:** UX40-01 is fixed in the scoped Bologna regression. A complete leaf-code name followed by Enter selects that code ahead of a containing parent name. Ambiguous names require an explicit path, arrow-key or pointer choice. Statistical definitions, plotting, original Bologna data and website/report assets are unchanged. Windows remains deferred and unverified; no push or deployment.

## Demonstration order · about 12–15 minutes

1. **Website → import:** scroll through the five-module presentation, then import a Bologna document into an editable temporary copy. Confirm the saved text is readable.
2. **Coding → reading:** select a short range, type `ancient manuscripts` and press Enter. Confirm the saved path ends in that leaf rather than its parent. Inspect the source range and tree. For duplicate names, choose a complete path or use arrows/pointer explicitly. Demonstrate Read/Revisit, Undo, both overview tracks, filtered-source jump, Keep and Resume.
3. **Relationships:** select a theme/code, inspect its highlighted source, locate the passage in Coding and return. Phone names remain available alongside the graph.
4. **Figures → report:** inspect all five original figures, the phone original-size viewer, report readouts, selected count rows, the movable heatmap lens and downloads. The fixed report remains the 19-document/874-coding Bologna example.
5. **Export → recover:** download project JSON, coding CSV, matrix CSV and Methods; restore JSON into a separate v5 copy and confirm the records and reading marks.

## Discussion and remaining work

Does the exact-name picker make the intended target clear? Are full paths and explicit selection sufficient when names collide? Does the source/tree layout help the author move from evidence to narrative?

The next required deliverable is a complete coded transcript with precise highlights and an adjacent saved Code/Category/Theme tree, preserving multi-code and cross-page correspondence. It is specified in UX-42 and not implemented. Editable reports, full method-specific workflows and 100-file capacity also remain open. The final product retains TA, Content Analysis and separately developed Comparative Analysis; the supplied assignment itself uses Content Analysis. Existing assistant-authored reports were produced outside the product and still need researcher review.

Owner/supervisor visual and research acceptance, VoiceOver, system reduced motion, OS download feedback, device details and formal release gates remain open. Earlier owner-confirmed Bologna phone reading/retention checks keep their original scope. Current picker phone checks are Chrome touch emulation, not physical-device or virtual-keyboard sign-off.

## Evidence and local access

UX-43:16 dedicated regressions pass, with12 failures against the saved old implementation;148 Node and163 Python tests pass (3 skipped). Fourteen workbench scenarios and the production-proxy core check pass;four production website/report pages are healthy. Normal console/HTTP errors and outside-project browser requests are0. The isolated production build passes with restored original dependencies. Environment and collector failures remain documented in raw/ux-43; see UX-43-CODE-POPUP-EXACT-MATCH.md.

Use [Website](http://127.0.0.1:4445/#workflow) → [Bologna QA](http://127.0.0.1:4449/w/?lang=en) → [Report](http://127.0.0.1:4445/report). QA is a local temporary service; choose the clearly named UX43 review copy. Loopback links require this computer. Real transcript text, private reports, exports and screenshots remain excluded from this shareable package.
