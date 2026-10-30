"""Extract authorized V2 source in spine order; English stays in /tmp.

Requires Pillow. Does not generate/overwrite Indonesian translations.
"""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
import argparse, hashlib, json, re, xml.etree.ElementTree as ET
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument("--sections", nargs="+", default=["pembuka", "prolog", "bab-1"])
selected=set(parser.parse_args().sections)
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parents[1]
source=next((ROOT/'raw').glob('* v02 *.epub'))
NS={'o':'http://www.idpf.org/2007/opf'}
def tag(e): return e.tag.split('}')[-1]
def marked(e):
    result=e.text or ''
    for c in e:
        inner=marked(c);cls=c.attrib.get('class','')
        if tag(c)=='img':
            image=Path(c.attrib.get('src','')).name
            if image=='Art_music.jpg':inner='♪'
            elif image=='Art_star1.jpg':inner='☆★'
            elif image=='Art_star2.jpg':inner='★☆'
        if tag(c) in ('em','i') or cls in ('italic','italic1'): inner='<em>'+inner+'</em>'
        if 'bolditalic' in cls: inner='<strong><em>'+inner+'</em></strong>'
        elif tag(c) in ('b','strong') or cls in ('bold','bold1'): inner='<strong>'+inner+'</strong>'
        result+=inner+(c.tail or '')
    return result
records={};files={}
with ZipFile(source) as z:
    package=ET.fromstring(z.read('OEBPS/content.opf'))
    manifest={e.attrib['id']:e.attrib['href'] for e in package.find('o:manifest',NS)}
    spine=[manifest[e.attrib['idref']] for e in package.find('o:spine',NS)]
    for path in spine:
        name=Path(path).stem
        match=re.match(r'chapter00([1-5])',name)
        slug=f'bab-{match[1]}' if match else 'prolog' if name.startswith('prologue') else {'afterword':'kata-penutup','appendix001':'catatan-penerjemah','cover':'pembuka','titlepage':'pembuka','preface001':'pembuka'}.get(name)
        if name.startswith('insert'):slug='pembuka'
        if not slug or slug not in selected: continue
        dest=ROOT/'public/assets/chapters/volume-2'/slug;dest.mkdir(parents=True,exist_ok=True)
        blocks=records.setdefault(slug,[]); files.setdefault(slug,[]).append(Path(path).name)
        p=0;h=0
        for e in ET.fromstring(z.read('OEBPS/'+path)).iter():
            kind=tag(e)
            if kind in ('p','h1','h2','h3'):
                if kind=='p':p+=1
                else:h+=1
                text=marked(e).strip()
                if not text or e.attrib.get('class')=='chapter-number':continue
                id=f'v2-{slug}-{name}-'+(f'p{p:03}' if kind=='p' else f'h{h}')
                blocks.append(dict(id=id,kind='text' if kind=='p' else 'heading',source=f'{Path(path).name}#{"p"+str(p) if kind=="p" else "h"+str(h)}',english=text))
            elif kind=='img':
                image=Path(e.attrib['src']).name
                if image=='Art_music.jpg' or image.startswith('Art_star'): continue
                id=f'v2-{slug}-{name}-{Path(image).stem}'
                sourceRef=Path(path).name+'#'+image
                if re.search(r'Art_(orn|star)|^Art_1\.',image):
                    blocks.append(dict(id=id,kind='separator',source=sourceRef));continue
                im=ImageOps.exif_transpose(Image.open(BytesIO(z.read('OEBPS/Images/'+image)))).convert('RGB')
                im.thumbnail((1800,2400),Image.Resampling.LANCZOS)
                target=dest/(Path(image).stem+'.webp');im.save(target,'WEBP',quality=89,method=6)
                blocks.append(dict(id=id,kind='image',source=sourceRef,src='assets/chapters/volume-2/'+slug+'/'+target.name,width=im.width,height=im.height))
# Repeated decorative images in the same XHTML need distinct anchors.
for blocks in records.values():
    occurrences={}
    for block in blocks:
        original=block['id'];occurrences[original]=occurrences.get(original,0)+1
        if occurrences[original]>1:block['id']=original+f"-{occurrences[original]}"
Path('/tmp/aku-v2-source.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
provenance={}
for slug,blocks in records.items():
    provenance[slug]={'files':files[slug],'blocks':[{**{k:v for k,v in b.items() if k!='english'},**({'sourceHash':hashlib.sha256(b['english'].encode()).hexdigest()} if 'english' in b else {})} for b in blocks]}
(ROOT/'docs/editorial/volume-2-sources.json').write_text(json.dumps({'sourceEpub':source.name,'sections':provenance},ensure_ascii=False,indent=2)+'\n')
for slug,b in records.items(): print(slug,len(b),'blocks',sum(x['kind']=='image' for x in b),'images')
