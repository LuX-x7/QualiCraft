"""Build the existing website for GitHub Pages without its Node/Python proxy.

The source checkout and original report assets are never rewritten. Dynamic
routes/middleware are omitted only from the isolated static build. Publishing
requires a real HTTPS workbench endpoint; loopback artifacts are test-only.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import urllib.parse

ROOT = Path(__file__).resolve().parents[2]


def configuration(prefix, workbench, local_test=False):
    if not prefix.startswith('/') or prefix.endswith('/') or '..' in prefix or '?' in prefix or '#' in prefix:
        raise ValueError('Choose one absolute repository prefix, without a trailing slash')
    target = urllib.parse.urlsplit(workbench)
    if target.username or target.password or target.query or target.fragment or target.path.rstrip('/') != '/w':
        raise ValueError('Use the complete workbench HTTPS /w address, without credentials or query')
    local = target.hostname in {'127.0.0.1', 'localhost', '::1'}
    if target.scheme != 'https' and not (local_test and local and target.scheme == 'http'):
        raise ValueError('The public workbench must use HTTPS')
    if not target.hostname or (local and not local_test) or target.hostname.endswith(('.invalid', '.example')):
        raise ValueError('A deployable workbench hostname is required')
    return {'prefix': prefix, 'workbench': workbench.rstrip('/'), 'test_only': local_test}


def build(args):
    config = configuration(args.prefix, args.workbench, args.allow_local_test)
    destination = Path(args.out).resolve()
    if destination.exists() and not (destination / '.qt-pages-artifact').is_file():
        raise ValueError('Output already exists and is not a QT Pages artifact')
    with tempfile.TemporaryDirectory(prefix='qt-pages-') as temporary:
        stage = Path(temporary)
        shutil.copytree(ROOT / 'website', stage, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns('node_modules', '.next', 'out', '.env*', '*.tsbuildinfo', 'middleware.ts'))
        dependencies = ROOT / 'website/node_modules'
        if not dependencies.is_dir():
            raise ValueError('Install website dependencies first')
        shutil.copytree(dependencies, stage / 'node_modules')
        # Flatten the English-only locale once: Pages has no runtime rewrite.
        shutil.copytree(stage / 'app/[locale]/(site)', stage / 'app/(site)')
        shutil.rmtree(stage / 'app/[locale]')
        for folder in ['api', 'w']:
            shutil.rmtree(stage / 'app' / folder)
        (stage / 'next.config.ts').write_text('export default ' + json.dumps({
            'output': 'export', 'basePath': args.prefix, 'trailingSlash': True,
        }) + '\n', encoding='utf-8')
        css = stage / 'app/t7.css'
        css.write_text(css.read_text(encoding='utf-8').replace("url('/fonts/", "url('" + args.prefix + '/fonts/'), encoding='utf-8')
        env = {**os.environ, 'NEXT_PUBLIC_QT_BASE_PATH': args.prefix,
               'NEXT_PUBLIC_QT_WORKBENCH_URL': config['workbench'],
               'SITE_URL': args.site_url.rstrip('/') + args.prefix}
        node = args.node or shutil.which('node')
        if not node:
            raise ValueError('Node.js is required')
        subprocess.run([node, str(stage / 'node_modules/next/dist/bin/next'), 'build'], cwd=stage, env=env, check=True)
        artifact = stage / 'out'
        if not (artifact / 'index.html').is_file() or not (artifact / 'report/index.html').is_file():
            raise ValueError('Static root/report pages were not generated')
        public = ROOT / 'website/public'
        files = {}
        for folder in ['report', 'worked-example', 'clips', 'fonts', 'original-bologna']:
            for source in (public / folder).rglob('*'):
                if source.is_file():
                    relative = str(source.relative_to(public))
                    output = artifact / relative
                    if output.read_bytes() != source.read_bytes():
                        raise ValueError('Original asset changed: ' + relative)
                    files[relative] = hashlib.sha256(source.read_bytes()).hexdigest()
        (artifact / '.nojekyll').write_text('', encoding='utf-8')
        (artifact / '.qt-pages-artifact').write_text('QT static website\n', encoding='utf-8')
        (artifact / 'qt-release.json').write_text(json.dumps({
            **config, 'source_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
            'source_dirty': bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT)),
            'asset_sha256': files,
        }, indent=2) + '\n', encoding='utf-8')
        if destination.exists():
            shutil.rmtree(destination)
        shutil.copytree(artifact, destination)
    print(json.dumps({'output': str(destination), 'original_assets_verified': len(files), **config}, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True)
    parser.add_argument('--workbench', required=True)
    parser.add_argument('--prefix', default='/QualiCraft')
    parser.add_argument('--site-url', default='https://lux-x7.github.io')
    parser.add_argument('--node')
    parser.add_argument('--allow-local-test', action='store_true')
    build(parser.parse_args())


if __name__ == '__main__':
    main()
