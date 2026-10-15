# Continue QualiCraft on another computer

The shared repository is [LuX-x7/QualiCraft](https://github.com/LuX-x7/QualiCraft). Its current review work is on `t7-site`; `main` may contain an earlier version. Windows validation remains deferred. These instructions describe the local review setup, not a Windows acceptance result or a standalone installer.

## Get the review version

Use Python 3.11 or newer, Node.js 24 and Git. From a terminal on macOS:

```sh
git clone --branch t7-site https://github.com/LuX-x7/QualiCraft.git
cd QualiCraft
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
```

The core uses the Python standard library; figure generation and the repository checks use the dependencies in `requirements.txt`. No model key is needed for the demonstration.

## Start an editable Bologna review copy

Copy the bundled CC0 example to an ignored local data directory. This preserves the source database and does not overwrite an existing review session:

```sh
python - <<'PY'
from pathlib import Path
import shutil
target = Path('data/bologna-review/qualicraft.sqlite3')
target.parent.mkdir(parents=True, exist_ok=True)
if not target.exists():
    shutil.copy2('demo-data/qualicraft.sqlite3', target)
print(target)
PY
QUALICRAFT_API_KEY_FILE= QUALICRAFT_API_BASE=http://127.0.0.1:9/v1 \
  QUALICRAFT_MODEL=review-no-provider python run.py \
  --host 127.0.0.1 --port 8833 --base-path /w \
  --data-dir data/bologna-review --backup-dir data/bologna-review-backups \
  --guide-dir data/no-guide
```

The workbench is at `http://127.0.0.1:8833/w?lang=en`. Its changes are confined to the copied project. Do not import private participant material for this review.

## Start the website

In a second terminal, from the checkout:

```sh
cd website
npm ci
npm run build
HOST=127.0.0.1 PORT=4445 QT_WORKBENCH_URL=http://127.0.0.1:8833 npm start
```

Open `http://127.0.0.1:4445/`, `/report` and `/w?lang=en`. Restart the website after every production rebuild. The loopback addresses work only on this computer; GitHub source publication does not update the hosted website.

## Check and review

From the checkout root, with the virtual environment active:

```sh
python -m unittest discover -s tests -v
python -m unittest discover -s tests -t . -v
node --check web/app.js
node --test tests/*.test.mjs tools/report/*.test.mjs
```

See [the short English review brief](docs/review/SUPERVISOR-ONE-PAGE.md), [the detailed guide](docs/review/SUPERVISOR-REVIEW.md), and [the current plan](docs/review/EXPERIENCE-ROADMAP.md). Both discovery forms now collect the same suite; the earlier collection failure remains in the evidence history.

Feedback goes to [GitHub Issues](https://github.com/LuX-x7/QualiCraft/issues). Use public or synthetic examples there; keep participant data and keys private. Local `data/`, backups and credentials stay outside Git. The bundled Bologna database is the explicit public-data exception.

Windows, physical device and assistive-technology acceptance require their own recorded results. Keep unverified checks visible. Do not deploy or change the repository's visibility as part of starting this local review.
