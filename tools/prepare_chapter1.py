"""Map the owner-provided EPUB chapter without publishing English prose.

Writes English extraction to /tmp only; committed provenance contains IDs/hashes.
Requires Pillow, like prepare_covers.py. This is not run during deployment.
"""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
import hashlib, json, re, xml.etree.ElementTree as ET
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
source=next((ROOT/'raw').glob('* v01 *.epub'))
files=['chapter001','chapter001_a','chapter001_d','chapter001_e','chapter001_f','chapter001_g']
ornaments={'Art_orn.jpg','Art_star1.jpg','Art_star.jpg'}
records=[]
def tag(e): return e.tag.split('}')[-1]
def marked(e):
    result=e.text or ''
    for c in e:
        inner=marked(c)
        if tag(c) in ['em','i']: inner='<em>'+inner+'</em>'
        if 'bolditalic' in c.attrib.get('class',''):inner='<strong><em>'+inner+'</em></strong>'
        elif tag(c) in ['b','strong']:inner='<strong>'+inner+'</strong>'
        result+=inner+(c.tail or '')
    return result
with ZipFile(source) as archive:
    for name in files:
        p=0
        tree=ET.fromstring(archive.read('OEBPS/Text/'+name+'.xhtml'))
        for el in tree.iter():
            kind=tag(el)
            if kind=='p':
                p+=1;text=marked(el).strip()
                if not text: continue
                records.append({'id':f'v1-b1-{name}-p{p:03}','kind':'text','source':f'{name}.xhtml#p{p}','english':text})
            elif kind=='h1' and el.attrib.get('class')=='chapter-title':
                records.append({'id':'v1-b1-title','kind':'heading','source':name+'.xhtml#chapter-title','english':''.join(el.itertext())})
            elif kind=='img':
                image=el.attrib['src'].split('/')[-1]
                if image in ornaments:
                    records.append({'id':f'v1-b1-{name}-{image.split(".")[0]}','kind':'separator','source':name+'.xhtml#'+image})
                    continue
                path=ROOT/'public/assets/chapters/volume-1/bab-1'/image.replace('.jpg','.webp')
                im=ImageOps.exif_transpose(Image.open(BytesIO(archive.read('OEBPS/Images/'+image)))).convert('RGB')
                im.thumbnail((1600,2200),Image.Resampling.LANCZOS)
                im.save(path,'WEBP',quality=88,method=6)
                records.append({'id':f'v1-b1-{name}-{image.split(".")[0]}','kind':'image','source':name+'.xhtml#'+image,'asset':'assets/chapters/volume-1/bab-1/'+path.name,'width':im.width,'height':im.height})
Path('/tmp/aku-v1-b1-source.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
provenance=[]
for record in records:
    item={k:v for k,v in record.items() if k!='english'}
    if 'english' in record:item['sourceHash']=hashlib.sha256(record['english'].encode()).hexdigest()
    provenance.append(item)
(ROOT/'docs/editorial/volume-1-bab-1-sources.json').write_text(json.dumps({'sourceEpub':source.name,'files':[x+'.xhtml' for x in files],'blocks':provenance},ensure_ascii=False,indent=2)+'\n')
print(f'{len(records)} mapped blocks; English extraction stays in /tmp; only chapter illustrations prepared.')
