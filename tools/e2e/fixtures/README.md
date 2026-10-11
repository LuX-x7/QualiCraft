# E2E fixtures

## `synthetic_interview.txt`

**This file is synthetic material. It is not a real interview.** No participant
was recorded, no transcript was collected, and no person or institution in it
exists. It was written for this test so that a fresh transcript with no coding
history can be pushed through all five modules without any real data leaving a
researcher's machine.

The text deliberately avoids Markdown: no `**`, no `#`, no list markers. That is
because the importer treats a transcript as verbatim text, and bold markers in
the source would show up in the reader and in every screenshot. The corpus that
ships with the hosted demonstration has its own Markdown numbering, which is a
property of that corpus and not something the importer strips.

Three ideas recur across the text — **isolation**, **schedule**, and **feedback**
— so that grouping codes into themes has something real to work with rather than
three arbitrary labels.

Word count and paragraph count are checked by `tools/e2e/smoke.py`, so the
fixture cannot silently drift outside the range the test assumes.
