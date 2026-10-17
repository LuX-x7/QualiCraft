"""Immutable, shared copies of the existing plotting bundles; no new statistics."""
from __future__ import annotations
import ast
import importlib.metadata
import platform
import subprocess
import zlib
import base64
import hashlib
import io
import json
import struct
import zipfile
from xml.etree import ElementTree as ET
from . import plotting,transcript
from .core import require

for prefix,uri in {'wp':'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing','a':'http://schemas.openxmlformats.org/drawingml/2006/main','pic':'http://schemas.openxmlformats.org/drawingml/2006/picture','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}.items():ET.register_namespace(prefix,uri)


def package_xml(root,namespace):
    # OPC readers include implementations that require the default package namespace.
    plain=ET.Element(root.tag.split('}')[-1],{'xmlns':namespace})
    for child in root:ET.SubElement(plain,child.tag.split('}')[-1],child.attrib)
    return ET.tostring(plain,encoding='utf-8',xml_declaration=True)


MAX_FIGURES=5
MAX_BUNDLE=8_000_000
MAX_UNPACKED=24_000_000


class FigureRenderError(RuntimeError):
    pass


def sha(payload):return hashlib.sha256(payload).hexdigest()


def identity(asset):return sha(transcript.canonical(asset).encode())


def options(value):
    require(isinstance(value,dict) and set(value)<=set(plotting.DEFAULT_OPTIONS),'The figure options are invalid')
    require(all(type(v) in (str,int,float,bool) and (not isinstance(v,float) or __import__('math').isfinite(v)) for v in value.values()),'The figure options are invalid')
    require(value.get('kind','frequency') in plotting.PLOT_KINDS,'Choose one of the five existing figures')
    return plotting.normalise(value)


def png_size(payload):
    require(payload[:16]==b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR' and len(payload)>=24,'The frozen PNG is invalid')
    width,height=struct.unpack('>II',payload[16:24]);require(0<width<=60000 and 0<height<=60000,'The frozen PNG size is invalid')
    return width,height


def freeze(project,settings):
    settings=options(settings)
    try:produced,result=plotting.bundle(project,settings)
    except (RuntimeError,OSError,subprocess.TimeoutExpired) as exc:raise FigureRenderError('Could not freeze the report figure: '+str(exc)) from exc
    buffer=io.BytesIO()
    with zipfile.ZipFile(buffer,'w',zipfile.ZIP_DEFLATED) as z:
        for name,payload in sorted(produced.items()):
            info=zipfile.ZipInfo(name,date_time=(1980,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,payload)
    bundle=buffer.getvalue();require(len(bundle)<=MAX_BUNDLE,'The figure bundle exceeds 8 MB; reduce its size in Figures')
    effective=next(ast.literal_eval(n.value) for n in ast.parse(produced['figure.py'].decode()).body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='SETTINGS' for t in n.targets))
    environment={'python':platform.python_version(),'font':effective['font']}
    for name in ('matplotlib','scipy'):
        try:environment[name]=importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:environment[name]='not installed'
    asset={'environment':environment,'options':settings,'result':result,'members':{n:sha(v) for n,v in sorted(produced.items())},'bundle':base64.b64encode(bundle).decode('ascii')}
    validate(asset)
    return identity(asset),asset


def files(asset):
    try:
        require(isinstance(asset['bundle'],str) and len(asset['bundle'])<=4*((MAX_BUNDLE+2)//3),'The frozen figure bundle is too large')
        payload=base64.b64decode(asset['bundle'],validate=True)
        require(len(payload)<=MAX_BUNDLE,'The frozen figure bundle is too large')
        with zipfile.ZipFile(io.BytesIO(payload)) as z:
            entries=z.infolist();expected={asset['options']['name']+'.'+ext for ext in plotting.FIGURE_EXTENSIONS}|set(plotting.SIDECAR_FILES)
            require(len(entries)==5 and {i.filename for i in entries}==expected and sum(i.file_size for i in entries)<=MAX_UNPACKED,'The frozen figure members are invalid or too large')
            return {i.filename:z.read(i) for i in entries}
    except (KeyError,TypeError,ValueError,zipfile.BadZipFile,RuntimeError,OSError,zlib.error) as exc:
        raise ValueError('The frozen figure bundle is invalid or too large') from exc


def validate(asset):
    require(isinstance(asset,dict) and set(asset)=={'environment','options','result','members','bundle'},'The frozen figure record is invalid')
    require(isinstance(asset['environment'],dict) and set(asset['environment'])=={'python','font','matplotlib','scipy'} and all(isinstance(v,str) and len(v)<=400 for v in asset['environment'].values()),'The figure environment record is invalid')
    require(options(asset['options'])==asset['options'],'The frozen figure options are invalid')
    require(isinstance(asset['result'],dict) and asset['result'].get('kind')==asset['options']['kind'],'The frozen figure result is invalid')
    require(isinstance(asset['members'],dict),'The frozen figure hashes are invalid')
    produced=files(asset);require({n:sha(v) for n,v in produced.items()}==asset['members'],'The frozen figure hash does not match')
    png_size(produced[asset['options']['name']+'.png'])


def referenced(entry):return {v['asset_id'] for v in entry['bindings'].get('figures',{}).values()}


def selected_assets(entry,assets):
    ids=referenced(entry);require(ids<=set(assets),'A frozen report figure is missing')
    return {id:assets[id] for id in sorted(ids)}


def html(entry,assets):
    esc=transcript.escaped;items=[]
    for i,figure in enumerate(entry['draft'].get('figures',[]),1):
        ref=entry['bindings']['figures'][figure['id']];asset=assets[ref['asset_id']];settings=asset['options'];produced=files(asset)
        png=base64.b64encode(produced[settings['name']+'.png']).decode('ascii')
        links=[]
        for name,payload in produced.items():
            if name not in plotting.SIDECAR_FILES:continue
            mime='text/csv' if name.endswith('.csv') else 'text/plain' if name.endswith('.py') else 'image/png' if name.endswith('.png') else 'image/svg+xml' if name.endswith('.svg') else 'application/pdf'
            links.append(f'<a download="{esc(name)}" href="data:{mime};base64,{base64.b64encode(payload).decode()}">{esc(name)}</a>')
        items.append(f'<figure><img style="width:100%;height:auto" alt="{esc(settings["title"])}" src="data:image/png;base64,{png}"><figcaption><strong>Figure {i}</strong> {esc(figure["caption"])}</figcaption><p class="meta">{esc(settings["credit"])}</p><details><summary>Frozen data and recipe</summary><p>{" · ".join(links)}</p><p class="meta">Vector and PDF files are included in the complete report ZIP.</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere">{esc(json.dumps(settings,ensure_ascii=False,indent=2))}</pre><p class="meta">Evidence SHA256 {ref["source_version"]}<br>Asset SHA256 {ref["asset_id"]}</p></details></figure>')
    return '<h2 id="figures">Figures</h2>'+''.join(items) if items else ''


def word_parts(payload):
    import math
    width,height=png_size(payload)
    # Square and moderately tall figures fit whole; split only genuinely long ones.
    if 6.9*height/width<=10:return [(0,0)]
    count=math.ceil((6.9*height/width)/6.8)
    require(count<=128,'This figure is too tall for Word; choose a smaller figure or use the original SVG.')
    boundaries=[0]
    try:
        from PIL import Image
        with Image.open(io.BytesIO(payload)) as image:
            for i in range(1,count):
                ideal=round(i*height/count);radius=max(10,round(height/count*.04));lo=max(boundaries[-1]+1,ideal-radius);hi=min(height-1,ideal+radius)
                strip=image.crop((0,max(0,lo-2),width,min(height,hi+3))).convert('L')
                scores=[sum((255-v)*n for v,n in enumerate(strip.crop((0,y,width,y+1)).histogram())) for y in range(strip.height)]
                best=min(range(lo,hi+1),key=lambda y:(sum(scores[max(0,y-lo):y-lo+5]),abs(y-ideal)))
                boundaries.append(best)
    except ImportError:
        boundaries=[round(i*height/count) for i in range(count)]
    boundaries.append(height)
    return [(round(a/height*100000),100000-round(b/height*100000)) for a,b in zip(boundaries,boundaries[1:])]


def add_word_image(body,package,payload,index,title,crop=(0,0),keep=True):
    # Native inline DrawingML, constrained by both page width and height.
    W=transcript.W;ns={'wp':'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing','a':'http://schemas.openxmlformats.org/drawingml/2006/main','pic':'http://schemas.openxmlformats.org/drawingml/2006/picture','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
    width,height=png_size(payload);visible_height=height*(1-(crop[0]+crop[1])/100000);scale=min(6.7/width,6.0/visible_height);cx,cy=round(width*scale*914400),round(visible_height*scale*914400)
    rid='image'+sha(payload)[:24];name=rid+'.png';package['word/media/'+name]=payload
    rels=ET.fromstring(package['word/_rels/document.xml.rels'])
    if not any(e.get('Id')==rid for e in rels):ET.SubElement(rels,'{http://schemas.openxmlformats.org/package/2006/relationships}Relationship',{'Id':rid,'Type':ns['r']+'/image','Target':'media/'+name})
    package['word/_rels/document.xml.rels']=package_xml(rels,'http://schemas.openxmlformats.org/package/2006/relationships')
    types=ET.fromstring(package['[Content_Types].xml']);T='{http://schemas.openxmlformats.org/package/2006/content-types}'
    if not any(e.get('Extension')=='png' for e in types):ET.SubElement(types,T+'Default',{'Extension':'png','ContentType':'image/png'})
    package['[Content_Types].xml']=package_xml(types,'http://schemas.openxmlformats.org/package/2006/content-types')
    para=transcript.word_tag(body,'p');pp=transcript.word_tag(para,'pPr')
    transcript.word_tag(pp,'spacing',{'before':'0','after':'120','line':'240','lineRule':'auto'})
    transcript.word_tag(pp,'jc',{'val':'center'});transcript.word_tag(pp,'keepLines')
    if keep:transcript.word_tag(pp,'keepNext')
    run=transcript.word_tag(para,'r');drawing=transcript.word_tag(run,'drawing');inline=ET.SubElement(drawing,'{'+ns['wp']+'}inline')
    ET.SubElement(inline,'{'+ns['wp']+'}extent',{'cx':str(cx),'cy':str(cy)});ET.SubElement(inline,'{'+ns['wp']+'}docPr',{'id':str(index),'name':title,'descr':title})
    graphic=ET.SubElement(inline,'{'+ns['a']+'}graphic');data=ET.SubElement(graphic,'{'+ns['a']+'}graphicData',{'uri':ns['pic']});pic=ET.SubElement(data,'{'+ns['pic']+'}pic');nv=ET.SubElement(pic,'{'+ns['pic']+'}nvPicPr');ET.SubElement(nv,'{'+ns['pic']+'}cNvPr',{'id':str(index),'name':name});ET.SubElement(nv,'{'+ns['pic']+'}cNvPicPr')
    fill=ET.SubElement(pic,'{'+ns['pic']+'}blipFill');ET.SubElement(fill,'{'+ns['a']+'}blip',{'{'+ns['r']+'}embed':rid})
    if crop!=(0,0):ET.SubElement(fill,'{'+ns['a']+'}srcRect',{'t':str(crop[0]),'b':str(crop[1])})
    ET.SubElement(ET.SubElement(fill,'{'+ns['a']+'}stretch'),'{'+ns['a']+'}fillRect')
    shape=ET.SubElement(pic,'{'+ns['pic']+'}spPr');transform=ET.SubElement(shape,'{'+ns['a']+'}xfrm');ET.SubElement(transform,'{'+ns['a']+'}off',{'x':'0','y':'0'});ET.SubElement(transform,'{'+ns['a']+'}ext',{'cx':str(cx),'cy':str(cy)});ET.SubElement(ET.SubElement(shape,'{'+ns['a']+'}prstGeom',{'prst':'rect'}),'{'+ns['a']+'}avLst')
