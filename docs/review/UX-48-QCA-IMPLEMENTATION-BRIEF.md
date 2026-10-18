# Next capability · Comparative QCA

2026-10-18 status: the bounded binary conservative slice in this brief is now implemented and technically accepted in [UX54](UX-54-COMPARATIVE-QCA.md), including persisted calibration, computed results, reports and independent code export. The original proposal below remains as its historical specification. Explicit exclusions remain outside this slice. Researcher / device / supervisor acceptance is separate.

2026-10-17. Implementation brief following UX-47. **Not implemented or accepted.** This records the research subtask's primary-source findings and a bounded first implementation proposal, not a claim that the final three-method requirement is complete. Existing qualitative coding counts and plotting stay unchanged.

## Proposed first slice

Binary crisp-set QCA with explicit researcher calibration, no logical remainders in minimisation. Up to six conditions and one separately defined outcome, up to 100 cases. Every case needs an explicit unit / identity and source-document mapping; multiple documents may belong to one case. Missing values remain missing and prevent execution rather than becoming zero. Each condition and outcome needs a definition, 0 / 1 decision rule and theoretical / evidence basis. Coding frequency is not automatic set membership. Cases, calibration decisions and exact evidence should remain reviewable.

The UI must separate editable calibration from saved computed results, preserve revision and source fingerprints, flag stale results, show mixed outcomes and counterexample cases, and export frozen data / parameters with independently runnable code. An aborted or failed run must not replace a saved result. It must distinguish the analysis of outcome presence from absence. A configuration result is not an automatically authored causal conclusion.

## Mathematical contracts

For case-level binary memberships X and Y, let I = count(X=1 and Y=1), NX = count(X=1), NY = count(Y=1). Necessary consistency = I/NY; necessary coverage = I/NX; sufficient consistency = I/NX; raw coverage = I/NY. A zero denominator is undefined. A multi-path solution uses the union of cases, not the sum of path coverages; unique coverage counts a path's positive cases that no other solution path covers. See [Dușa, sufficiency and coverage](https://dusadrian.github.io/QCAbook/analysisofsufficiency.html) and [necessity](https://dusadrian.github.io/QCAbook/analysisofnecessity.html).

Truth tables retain all 2^k configurations, case IDs, positive and negative outcome counts, total frequency and consistency. Frequency below the chosen cutoff is a remainder. With two consistency cutoffs ic0 < ic1, positive means r >= ic1; the intermediate interval is a contradiction; below ic0 is negative. The official default sets ic0 = ic1, leaving that interval empty. Therefore an empirical mixed-outcome flag must be kept independently: the same configuration can contain both outcomes even when its threshold label is negative or positive. [Official truthTable documentation](https://search.r-project.org/CRAN/refmans/QCA/html/truthTable.html).

Conservative minimisation must not silently borrow unknown, low-frequency or excluded configurations. Every returned Boolean term, expanded to all its completions, must be a subset of the eligible positive configuration set. Return alternative equally minimal covers or explicitly bound / report incomplete enumeration; disclose the optimisation criterion. Do not call this parsimonious or intermediate analysis. [Official minimize documentation](https://search.r-project.org/CRAN/refmans/QCA/html/minimize.html).

## Independent known-answer gate

Use a small Boolean mathematics fixture, clearly separate from Bologna research examples: all eight A/B/C combinations, one case each, Y=1 only for 101, 110 and 111. At frequency 1 and consistency 1, the unique minimum is AB + AC. Each term has consistency 1, raw coverage 2/3 and unique coverage 1/3; solution consistency and coverage are 1. A has necessity consistency 1 and coverage 3/4.

- Remove case 111: conservative output must remain A~BC + AB~C. AB + AC would improperly borrow an unobserved configuration.
- Add a second 101 case with Y=0: mixed-outcome remains true; row consistency is 1/2. At the default cutoff 1 the row is negative; at ic1=1 and ic0=.5 it is a contradiction. Remaining positive configurations minimise to AB.
- Increase frequency cutoff to two in the original eight-case fixture: no eligible positive configuration and no solution.
- Cover zero-positive outcomes, duplicate cases, missing / invalid values, constant conditions, multiple equally minimal covers, negated outcome, threshold boundary equality and capacity / interruption failures.
- Independently enumerate every small Boolean cube and verify the no-remainder invariant. Re-run the exported standalone code and compare all values and IDs; report any discrepancy. No official R execution has yet been performed.

## Explicit exclusions for that first slice

Fuzzy memberships, multi-value sets, PRI filtering, intermediate / directional expectations, parsimonious remainders, temporal QCA and automatic robustness or causal inference are outside this proposed first slice. They cannot be advertised as available merely because a method selector exists. The owner's broader final QCA requirement stays open until the agreed implemented range and research workflow are actually validated.

Public sources inform the contracts; no third-party implementation or assets are copied. New algorithm tests use synthetic Boolean rows, not private interviews. Product evidence and screenshots continue to use disposable public Bologna copies. Windows remains deferred; no push or deployment.
