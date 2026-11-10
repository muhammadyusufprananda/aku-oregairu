"""Group English spine fragments into narrative sections after prepare_english.py."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]/'src/content/english'
records=json.loads((root/'index.json').read_text()); grouped={}
for c in records:
    match=re.match(r'chapter(\d+)',c['slug'])
    slug='bab-'+str(int(match[1])) if match else 'prolog' if c['slug'].startswith('prologue') else 'kata-penutup' if c['slug'].startswith('afterword') else 'catatan-penerjemah' if c['slug'].startswith('appendix') else 'pembuka' if c['order']< next((r['order'] for r in records if r['volume']==c['volume'] and re.match(r'(chapter|prologue)',r['slug'])),999) else c['slug']
    if match and int(match[1]) == 0: slug='prolog'; match=None
    key=(c['volume'],slug)
    entry=grouped.setdefault(key,{'record':{**c,'id':f"{c['volume']}-en-{slug}",'slug':slug,'editorialStatus':'draft','kind':'chapter' if match else 'backmatter' if slug in ('kata-penutup','catatan-penerjemah') else 'frontmatter','number':int(match[1]) if match else None},'blocks':[]})
    entry['blocks'].extend(json.loads((root/(c['id']+'.json')).read_text())['blocks'])
for p in root.glob('volume-*.json'):p.unlink()
index=[]
for (volume,slug),entry in grouped.items():
    c=entry['record'];blocks=entry['blocks']
    headings=[b['text'].strip() for b in blocks if b['kind']=='heading' and not b['text'].strip().isdigit()]
    c['title']={'pembuka':'Opening','prolog':'Prologue','kata-penutup':'Afterword','catatan-penerjemah':'Translation Notes'}.get(slug) or (headings[0] if headings else c['title'])
    index.append(c);(root/(c['id']+'.json')).write_text(json.dumps({'blocks':blocks},ensure_ascii=False)+'\n')
(root/'index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
print(len(index),'English sections')
