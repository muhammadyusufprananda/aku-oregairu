"""Prepare authorized V3–V6 editorial inputs from the existing English editions.

Only source references/hashes are committed; translation inputs go to /tmp.
Uses existing optimized images, without runtime or CI translation dependencies.
"""
from pathlib import Path
import json,hashlib,re,shutil
ROOT=Path(__file__).resolve().parents[1]
records=json.loads((ROOT/'src/content/english/index.json').read_text())
source={};manifest={}
for n in range(3,7):
 volume=f'volume-{n}';sections={};manifest[volume]={'sourceEdition':'Owner-provided English EPUB; existing English edition mapping','sections':sections,'omitted':'Publisher promotions, navigation duplicates and administrative copyright text; attribution summarized in opening.'}
 for record in [r for r in records if r['volume']==volume]:
  if record['slug'] in ['newslettersignup','nav']:continue
  slug='bonus-track' if n==3 and record['slug']=='bab-7' else record['slug']
  incoming=json.loads((ROOT/'src/content/english'/(record['id']+'.json')).read_text())['blocks']
  blocks=[]
  for b in incoming:
   filename=Path(b['source'].split('#')[0]).name
   if filename=='copyright.xhtml':continue
   if filename=='toc.xhtml' and ('Newsletter' in b['text'] or b['text'] in ['Cover','Insert','Title Page','Copyright','Cast of Characters']):continue
   if b['kind']=='heading' and (b['text'].strip().isdigit() or (slug=='bonus-track' and b['text']=='BT')):continue
   id=f'v{n}-{slug}-'+b['id'].removeprefix('en-')
   item={**b,'id':id}
   literals={'Art_arrow1':'←','Art_arrow':'→','Art_1a':'⑧'}
   if n==5:literals.update({'Art_P164a':'月','Art_P164b':'旨','Art_P164c':'脂'})
   if n==6:literals.update({'Art_P243a':'相模','Art_P243b':'相撲'})
   if b['kind']=='image' and Path(b['src']).stem in literals:
    item={'id':id,'kind':'text','source':b['source'],'text':literals[Path(b['src']).stem]}
    old=ROOT/'public/assets/chapters'/volume/slug/Path(b['src']).name
    if old.exists():old.unlink()
    blocks.append(item);continue
   if b['kind']=='image':
    image=ROOT/'public'/b['src'];dest=ROOT/'public/assets/chapters'/volume/slug/image.name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(image,dest)
    item['src']=str(dest.relative_to(ROOT/'public'));item['englishAlt']=item.pop('text');item.pop('emphasis',None)
   elif b['kind']!='separator':
    # English edition offsets are Python code-point offsets from prepare_english.py.
    text=b['text'];value='';cursor=0
    import html
    for mark in b.get('emphasis',[]):
     value+=html.escape(text[cursor:mark['start']]);fragment=html.escape(text[mark['start']:mark['end']]);style=mark['style']
     value+=('<strong><em>'+fragment+'</em></strong>' if style=='strong-em' else '<'+style+'>'+fragment+'</'+style+'>');cursor=mark['end']
    value+=html.escape(text[cursor:]);item.pop('text');item.pop('emphasis',None);item['english']=value
   blocks.append(item)
  if not blocks:continue
  kind='backmatter' if slug in ['bonus-track','kata-penutup','catatan-penerjemah'] else 'frontmatter' if slug in ['pembuka','prolog'] else 'chapter'
  section={'volume':volume,'slug':slug,'kind':kind,'number':int(slug.removeprefix('bab-')) if kind=='chapter' else None,'order':len(sections),'blocks':blocks}
  source[f'{volume}/{slug}']=section
  sections[slug]={k:v for k,v in section.items() if k!='blocks'}
  sections[slug]['blocks']=[{**{k:v for k,v in b.items() if k not in ['english','englishAlt','text']},**({'sourceHash':hashlib.sha256(b['english'].encode()).hexdigest()} if 'english' in b else {})} for b in blocks]
path=Path('/tmp/aku-v3-6-source.json');path.write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
(ROOT/'docs/editorial/volumes-3-6-sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for volume in manifest:
 sections=[s for s in source.values() if s['volume']==volume]
 print(volume,len(sections),'sections',sum(len(s['blocks']) for s in sections),'blocks',sum(sum(len(b.get('english','').split()) for b in s['blocks']) for s in sections),'words')
