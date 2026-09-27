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

## Planned phases

1. MVP: local project store, manual coding, review queue, Qwen-compatible API, exports, and benchmark tooling.
2. Research tooling: richer code hierarchies, co-occurrence tables, reproducible plots, REFI-QDA export, and stronger evaluation reports.
3. Hosted edition: authenticated accounts, isolated encrypted storage, provider abstraction, and deployment-specific privacy controls.
