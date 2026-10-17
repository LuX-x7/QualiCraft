# QualiCraft architecture (MVP)

This document supersedes the early planning notes that assumed a fully local language model. The MVP keeps source files, the codebook, accepted codings, memos, and activity records on the researcher's computer, while allowing an explicitly confirmed analysis request to use a compatible cloud model such as Qwen3.8-Flash.

## Runtime layers

```text
Browser UI (English)
        |
loopback HTTP + per-process token
        |
Python standard-library service
  |                 |
SQLite project store  optional OpenAI-compatible model endpoint
```

The service is intentionally small: Python's `http.server`, SQLite, and browser APIs are enough for the first release. No package installation is required for the core workflow. The browser never receives the provider key; the service holds it in memory and places it only in the outbound Authorization header.

## Boundary between research data and model calls

The researcher chooses a document and scope. The server creates a request preview containing:

- the selected target passage(s);
- an optional immediately preceding doctor/interviewer question;
- the project codebook definitions;
- the coding mode and system instructions;
- the configured endpoint and model name.

The researcher must confirm the preview. Each segment is sent separately. The response is parsed as JSON, and every returned quote must be an exact, uniquely locatable substring of the immutable source. Suggestions that fail this check remain outside the formal coding table. A researcher can accept or reject each remaining suggestion.

## Why the public website is a later phase

The local MVP is suitable for a single researcher or a controlled local network. It should not be exposed directly on the internet. A public service needs:

- an identity provider and secure session/CSRF model;
- tenant-isolated, encrypted storage and backups;
- explicit retention and deletion controls;
- provider-key ownership, quotas, billing, and abuse limits;
- institutional GDPR/ethics review and a data-processing agreement where applicable;
- job isolation and observability without logging transcript contents.

GitHub Pages can host documentation and a static product tour, but it cannot run the Python service or safely store private projects. Until the hosted architecture is reviewed, the supported public artifact is the source repository and local application.

## Project format

A project is a single JSON document stored in one SQLite row. The format is versioned.

`schema_version: 2` added the codebook hierarchy and the fields the analysis workflows need:

- a code gains `parent_id` (its place in the code tree), `memo`, `inclusion`, `exclusion`, `anchor_examples`, `status` and `order`;
- a document gains `attributes`, reserved for case-level metadata.

`migrate()` upgrades a v1 project in place the first time it is read. Every added value is a neutral default, so an existing codebook, its codings and all character offsets are preserved untouched. Migration is idempotent and runs inside `Store.get` and `Store.change`.

The code tree is validated on every write: a code may not be its own parent, may not point at a missing parent, and may not be moved beneath one of its own descendants.

## Planned phases

1. MVP: local project store, manual coding, review queue, Qwen-compatible API, exports, and benchmark tooling. **Complete.**
2. Research tooling: codebook hierarchy, code-level maintenance (rename, re-parent, merge, delete) and the methodological code fields are **complete**. Still to come: document attributes and cross-tabulation, inter-coder reliability, co-occurrence tables, reproducible plots, and REFI-QDA export.
3. Hosted edition: authenticated accounts, isolated encrypted storage, provider abstraction, and deployment-specific privacy controls.

## Optional research roles (v5 extension, UX-51)

A code may carry `research_role: "theme" | "category" | "code"`. Absence means unassigned; no role is inferred or persisted from tree depth. Create accepts an optional role; code update sets a valid role or removes it with JSON null. A saved code field containing null or any other value is invalid on restore. Parent IDs remain the sole source of ancestry. Role-only changes retain source text, annotation IDs/ranges, structural root groupings, all existing statistics and figure inputs. They are ordinary research edits: immediately saved, audited, snapshotted and included in JSON recovery. Merge retains the target role.

Coded HTML / Word prefer explicit roles; the optional depth-based display preset fills unassigned nodes only. A frozen path records explicit `research_role` alongside its displayed `role`. Old paths remain unchanged when none was assigned. Report evidence fingerprints include this optional key only when present, preserving all legacy fingerprints. Role edits mark saved reports stale; a refresh remains explicit. Report starting labels use assigned Theme / Category nodes when any role on the selected path is explicit; unassigned nodes on such a path are not invented research categories. The separately chosen legacy display starting labels remain available for wholly unassigned paths. Neither these report labels nor external Word edits write research roles back into the codebook.

### Frozen report figures (UX52)

A report draft may have an optional `figures` list (up to five `{id, options, caption}` records). Entry bindings may include figure IDs with `{asset_id, source_version}`. Report state optionally carries `assets`, a content-addressed pool shared across the current and retained historical entries. Each asset freezes the existing plotting bundle, normalized requested options, numeric result, per-member hashes and generation environment. No existing count or drawing function changes. Identical assets are reused; assets no longer referenced after history pruning are removed. Legacy drafts, entries, fingerprints and figure-free JSON exports retain their original shape. These are optional schema-v5 / report-format-1 extensions; older clients may not understand them.

Rendering happens on a detached project before acquiring SQLite's writer lock. The short commit rechecks report revision and current coding fingerprint, preserves concurrent reading metadata, and returns 409 on a coding or report conflict. Errors and capacity failures leave report, audit and snapshots unchanged. New / changed figures in stale writing require explicit evidence refresh; caption-only revisions retain the old frozen assets. Images, counts and code are never regenerated during export or history restore.

HTML embeds proportionate PNGs and CSV / recipe downloads, Word embeds the saved PNGs with editable captions, and the complete report ZIP retains all original five bundle members plus parameters, results and environment records. Standalone report JSON with figures uses a `qt-report-package-v1` envelope (`report`, `figure_assets`); figure-free report JSON remains the exact legacy entry. Project JSON, not report JSON, restores the complete QT workspace. No stored recipe from a restored asset is executed by opening or exporting it. Each bundle is limited to 8 MB compressed / 24 MB unpacked; the existing 19 MB project capacity limit still applies across shared assets and retained versions. Large changed figures may reach that guard; this is not an unrestricted capacity guarantee.
