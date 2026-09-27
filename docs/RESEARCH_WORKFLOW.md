# Research workflow

QualiCraft follows a simple separation between source material, formal coding, and model suggestions.

1. Import a de-identified transcript. The source text remains read-only and receives a SHA-256 checksum.
2. Define a codebook. A code has a name, definition, and display color.
3. Code passages manually or open the AI analysis flow.
4. Inspect the request preview before any cloud call. The preview shows the target text, optional preceding question, complete codebook, endpoint, and model.
5. Let suggestions remain pending until a researcher accepts or rejects each one.
6. Export the project or CSV only after checking the source, coding, memos, and provenance.

The model is asked to return exact contiguous quotes. The server maps offsets back to the immutable source and rejects hallucinated, ambiguous, out-of-range, or codebook-invalid suggestions. This is an integrity check, not a guarantee that an interpretation is methodologically appropriate.

## API data flow

```text
local transcript -> request preview -> researcher confirmation -> Qwen/OpenAI-compatible endpoint
       ^                                                        |
       |                                                        v
       +----------- quote and offset validation <- JSON suggestions
                                      |
                              pending review queue
                                      |
                         accept/reject + activity trail
```

Only the explicitly selected text, optional speaker context, codebook definitions, and system instructions are sent. Project IDs, file paths, keys, and the rest of the transcript are not included in the request. Segment requests are sent one at a time; the application never retries a failed or timed-out paid request automatically.

## Interpretation and evaluation

Use deductive coding when the codebook is established in advance. Use inductive coding when a new concept may be proposed, but require a researcher to define and accept the code before treating it as formal data.

The TU Delft importer preserves the source offsets in Python Unicode character space (`start` inclusive, `end` exclusive). The benchmark evaluator performs one-to-one quote/code matching at exact or overlap IoU thresholds. It reports agreement with the original researchers' coding decisions, not objective truth, diagnostic accuracy, or evidence that a study followed pure grounded theory.
