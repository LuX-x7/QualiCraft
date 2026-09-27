# Contributing

Small, focused changes are welcome. Please keep the local-first boundary clear: never add a default network call, never include a real transcript or credential in a fixture, and never turn a model suggestion into a formal coding without an explicit review path.

Before opening a pull request, run:

```powershell
python -m unittest discover -s tests -v
node --check web/app.js
```

Use fictional or public-domain text in tests. If a change affects the request payload, quote validation, project format, or data export, add a regression test and describe the privacy impact in the pull request.
