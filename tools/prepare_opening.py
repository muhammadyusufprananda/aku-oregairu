"""Prepare Volume 1 front matter from EPUB spine order; English text stays in /tmp."""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
import hashlib, json, posixpath, xml.etree.ElementTree as ET
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
source=next((ROOT/'raw').glob('* v01 *.epub'))
output=ROOT/'public/assets/chapters/volume-1/pembuka'
output.mkdir(parents=True,exist_ok=True)
records=[]
with ZipFile(source) as archive:
    container=ET.fromstring(archive.read('META-INF/container.xml'))
    opf=next(e.attrib['full-path'] for e in container.iter() if e.tag.endswith('rootfile'))
    package=ET.fromstring(archive.read(opf))
    manifest={e.attrib['id']:e.attrib for e in package.iter() if e.tag.endswith('item')}
    for ref in package.iter():
        if not ref.tag.endswith('itemref'):continue
        path=posixpath.normpath(posixpath.join(posixpath.dirname(opf),manifest[ref.attrib['idref']]['href']))
        if path.endswith('/chapter001.xhtml'):break
        name=Path(path).stem
        tree=ET.fromstring(archive.read(path))
        record={'source':path,'fileHash':hashlib.sha256(archive.read(path)).hexdigest(),'images':[],'english':[]}
        for el in tree.iter():
            tag=el.tag.split('}')[-1]
            if tag in ['p','h1','h2']:
                text=''.join(el.itertext()).strip()
                if text:record['english'].append(text)
            if tag!='img':continue
            member=posixpath.normpath(posixpath.join(posixpath.dirname(path),el.attrib['src']))
            if name=='copyright':continue # Publisher ornaments, not narrative art.
            data=archive.read(member)
            image=ImageOps.exif_transpose(Image.open(BytesIO(data))).convert('RGB')
            image.thumbnail((1800,2400),Image.Resampling.LANCZOS)
            target=output/(name+'.webp')
            image.save(target,'WEBP',quality=89,method=6)
            record['images'].append({'id':f'v1-opening-{name}','kind':'image','source':path+'#'+Path(member).name,'src':'assets/chapters/volume-1/pembuka/'+target.name,'width':image.width,'height':image.height,'sourceHash':hashlib.sha256(data).hexdigest()})
        records.append(record)
Path('/tmp/aku-v1-opening-source.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
provenance={'sourceEpub':source.name,'files':[{k:v for k,v in r.items() if k!='english'} for r in records]}
(ROOT/'docs/editorial/volume-1-pembuka-sources.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
print(len(records),'source files;',sum(len(r['images']) for r in records),'illustrated pages prepared in spine order.')
