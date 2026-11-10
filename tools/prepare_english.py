"""Import owner-authorized English EPUBs in spine order; never publish EPUB files."""
from pathlib import Path
from zipfile import ZipFile
from io import BytesIO
import json, posixpath, re, xml.etree.ElementTree as ET
from PIL import Image, ImageOps
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/content/english'
OUT.mkdir(exist_ok=True)
ns = {'o': 'http://www.idpf.org/2007/opf'}
def tag(e): return e.tag.split('}')[-1]
def prose(e):
    text = ''; marks = []
    def visit(node, em=False, strong=False):
        nonlocal text
        cls = node.get('class', '').lower()
        em = em or tag(node) in ('em', 'i') or 'italic' in cls
        strong = strong or tag(node) in ('strong', 'b') or 'bold' in cls
        def add(s):
            nonlocal text
            if not s: return
            start = len(text); text += s
            if em or strong: marks.append({'start':start,'end':len(text),'style':'strong-em' if em and strong else 'em' if em else 'strong'})
        add(node.text)
        for child in node:
            if tag(child) == 'br': add('\n')
            elif tag(child) == 'img':
                name = child.get('src','').lower()
                if 'music' in name: add('♪')
                elif 'star' in name: add('☆')
            else: visit(child, em, strong)
            add(child.tail)
    visit(e)
    return text, marks
index=[]
for source in sorted((ROOT/'raw').glob('*.epub')):
    number=re.search(r' v(\d+(?:\.\d+)?) ',source.name)[1]
    volume='volume-'+str(float(number)).removesuffix('.0').replace('.','-')
    with ZipFile(source) as z:
        container=ET.fromstring(z.read('META-INF/container.xml'))
        package=next(e.get('full-path') for e in container.iter() if tag(e)=='rootfile')
        directory=posixpath.dirname(package)
        opf=ET.fromstring(z.read(package))
        manifest={e.get('id'):e.get('href') for e in opf.find('o:manifest',ns)}
        spine=[posixpath.normpath(posixpath.join(directory,manifest[e.get('idref')])) for e in opf.find('o:spine',ns)]
        for order,path in enumerate(spine):
            root=ET.fromstring(z.read(path)); body=next((e for e in root.iter() if tag(e)=='body'),None)
            if body is None: continue
            slug=Path(path).stem.lower(); blocks=[]; images=set()
            def image(e):
                src=e.get('src') or e.get('{http://www.w3.org/1999/xlink}href') or e.get('href')
                if not src: return
                full=posixpath.normpath(posixpath.join(posixpath.dirname(path),src))
                if full in images: return
                images.add(full)
                if re.search('music|star',Path(full).name,re.I): return
                if re.search(r'orn|^Art_1\.',Path(full).name,re.I):
                    blocks.append(dict(id=f'en-{slug}-{len(blocks)}',kind='separator',text='⁂',source=path+'#'+src)); return
                im=ImageOps.exif_transpose(Image.open(BytesIO(z.read(full)))).convert('RGB'); im.thumbnail((1800,2400),Image.Resampling.LANCZOS)
                target=ROOT/'public/assets/english'/volume/(Path(full).stem+'.webp');target.parent.mkdir(parents=True,exist_ok=True)
                if not target.exists(): im.save(target,'WEBP',quality=85,method=6)
                blocks.append(dict(id=f'en-{slug}-{len(blocks)}',kind='image',text=e.get('alt') or 'Illustration',source=path+'#'+src,src=str(target.relative_to(ROOT/'public')),width=im.width,height=im.height))
            def walk(e):
                kind=tag(e)
                if kind in ('img','image'): image(e);return
                if kind in ('p','h1','h2','h3','h4','li'):
                    text,marks=prose(e)
                    if text.strip(): blocks.append(dict(id=f'en-{slug}-{len(blocks)}',kind='heading' if kind.startswith('h') else 'text',text=text,source=path+'#'+str(len(blocks)),**({'headingLevel':2} if kind.startswith('h') else {}),**({'emphasis':marks} if marks else {})))
                    for child in e.iter():
                        if tag(child) in ('img','image'): image(child)
                    return
                for child in e: walk(child)
            walk(body)
            if not blocks: continue
            title=next((b['text'].strip() for b in blocks if b['kind']=='heading'),None)
            title=title or {'cover':'Cover','titlepage':'Title Page','copyright':'Copyright'}.get(slug) or slug.replace('_',' ').replace('-',' ').title()
            record=dict(id=f'{volume}-en-{slug}',volume=volume,slug=slug,number=None,kind='frontmatter',order=order,title=title,editorialStatus='reviewed',language='en')
            index.append(record)
            (OUT/(record['id']+'.json')).write_text(json.dumps({'blocks':blocks},ensure_ascii=False)+'\n')
    print(volume, sum(c['volume']==volume for c in index),'sections',flush=True)
(OUT/'index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')

# Keep narrative sections together, including illustration-only spine fragments.
import runpy
runpy.run_path(str(ROOT/'tools/group_english.py'))
