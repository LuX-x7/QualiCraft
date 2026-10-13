# QualiCraft — website

The English-first marketing site for QualiCraft, plus the read-only demo of
the workbench at `/w`. It is a Next.js app that renders from committed files:
no database, no accounts, no CMS. The pages are:

| path | what it is |
|---|---|
| `/` | the six-block homepage: hero, the five-module walkthrough, the two methods, the boundary, the datasets |
| `/report` | a worked example — five figures drawn by the workbench from the Bologna corpus, each with its counts one click away |
| `/about` | what the tool is and the principles it follows |
| `/w` | the workbench itself, proxied to the separate Python process (see `app/w/[[...path]]/route.ts`) |
| `/api/health` | the platform's liveness probe; answers without rendering anything |

## Local development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # production build
PORT=4321 npm start  # serve the build
```

The site needs no database and no environment variables. To reach a real
workbench through `/w`, start one (`python run_demo.py` in the repository
root) or point `QT_WORKBENCH_URL` at a running instance; without one, `/w`
answers 502 while everything else works.

## Where the content lives

Every string the public pages render is in `lib/site/content.ts`, and the
dataset cards are generated into `lib/site/data-cards.json` by
`tools/site/build_data_cards.py`, which reads `qualicraft/datasets.py` — the
site never keeps a second copy of that list, and a card whose file hash
disagrees with the recorded one is refused rather than written.

The `/report` page's figures and count tables are produced by
`tools/report/build_assets.py`, which calls the workbench's own export path
(`plotting.bundle()`) and writes the SVGs, CSVs and `manifest.json` into
`public/report/`. The manifest records the commit, the time, the command and
the SHA-256 of every file; the page re-hashes them on every render and
refuses to show figures that no longer match. Re-run the export whenever the
corpus or the plotting code changes:

```bash
python tools/report/build_assets.py
python tools/site/build_data_cards.py   # after a datasets.py change
```

The unit sentence under every figure caption is the workbench's own `CREDIT`
text, carried through the manifest — the site does not write a second copy of
it.

## Type and colour

Two families, self-hosted and subset in `public/fonts/` with their OFL
licences beside them: Source Serif 4 for headings and body, JetBrains Mono
for numbers, metadata and captions. `tools/site/prepare_fonts.py` re-derives
the pair from upstream and records the source hash. The design tokens are in
`app/t7.css`: paper ground, near-black ink, two accents (a grey-blue and a
rust red), an 8 px spacing scale, and the motion timings the pages were
measured against.

## Deploying

`render.yaml` at the repository root describes the two services (this site
and the workbench) and their wiring. `autoDeployTrigger` is off on purpose:
a commit should not quietly redeploy something a reviewer is in the middle of
checking.
