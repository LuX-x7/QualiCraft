"""Materialise the canonical versioned method orientations for the static site."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT))
from qualicraft.method_maps import MAPS
if __name__=='__main__':
    target=ROOT/'website/lib/site/method-maps.json'
    target.write_text(json.dumps(MAPS,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Wrote '+str(target.relative_to(ROOT))+' from qualicraft/method_maps.json')
