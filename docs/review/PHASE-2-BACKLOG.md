# Phase 2 backlog

Maintained from the director's rulings. Each item is closed by a commit or by a
recorded decision, never by a note alone.

| # | Item | Owning task | Status |
|:--|:--|:--|:--|
| P2-1 | Co-occurrence empty state explains that the figure needs overlapping ranges | `ad1e5e9` | closed |
| P2-2 | "You can put in a paper" removed from the workbench and README | `e0ba618`, `653ab89` | closed |
| P2-3 | B2: one-click "all five modules" preset | this commit | closed |
| P2-4 | Codebook count as a hint to expand | `1209a90` + this commit | closed (wording changed to "show codes", assertion shown to discriminate) |
| P2-5 | Dialog measurement at 390px | script written, no results yet | open - blocked on: snapshots has no visible control at 390px |
| P2-7 | `smoke_mouse.py`, real mouse selection | Phase 2 | open |
| Close-out | A test that tools/e2e/preset.py exists and imports, so forgetting to run it is noticed | Phase 2 | open (director) |

---

## T6 (website) — must not be dropped when the redesign starts

**Added 2026-10-11, at the director's instruction. Phase 2 does not touch
`website/`; this item travels with T6 so that it cannot be assumed complete.**

`website/lib/kernel/qt-seed.ts:341` still reads:

```
'Publication figures drawn by an exported Python script, so a co-author can
 re-run them. Needs matplotlib; scipy adds clustering.'
```

"Publication figures" is the same claim that was removed from the workbench
(P2-2), from `README.md`, and from `docs/DESIGN.md`. A journal's requirements
differ from one to the next, so the tool cannot assert that a figure is
publication-ready; what it can assert is that each figure states the unit it
counts.

**The live site does not currently carry this string** — searching the deployed
home page for "publication figures" returns false, while "states what it counts"
returns true. So it is either bound to a page that is not the home page, or was
already superseded in the deployed build. It is uncleaned in the source either
way.

**Action when T6 runs:** replace with wording of the same shape as the fix
already applied elsewhere, and re-run the repository-wide sweep for
`publication-grade|publication-ready|publication-oriented|put in a paper|期刊`
to confirm nothing else survives in `website/`.
