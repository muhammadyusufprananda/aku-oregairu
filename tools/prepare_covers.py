"""Extract only declared cover images from owner-authorized local EPUBs.

Requires Pillow. Never extracts chapter text; raw files are never copied to public.
"""
from pathlib import Path
from io import BytesIO
import json
import posixpath
import re
import xml.etree.ElementTree as ET
from zipfile import ZipFile
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
output = ROOT / 'public/assets/covers'
output.mkdir(parents=True, exist_ok=True)
records = []
for source in sorted((ROOT / 'raw').glob('*.epub')):
    match = re.search(r' v(\d+(?:\.5)?) ', source.name)
    if not match:
        continue
    number = str(float(match[1])).removesuffix('.0')
    stem = 'volume-' + number.replace('.', '-')
    with ZipFile(source) as archive:
        container = ET.fromstring(archive.read('META-INF/container.xml'))
        opf = next(e.attrib['full-path'] for e in container.iter() if e.tag.endswith('rootfile'))
        package = ET.fromstring(archive.read(opf))
        cover_id = next((e.attrib.get('content') for e in package.iter()
                         if e.tag.endswith('meta') and e.attrib.get('name') == 'cover'), None)
        cover = next(e.attrib['href'] for e in package.iter() if e.tag.endswith('item')
                     and (e.attrib.get('id') == cover_id or 'cover-image' in e.attrib.get('properties', '')))
        member = posixpath.normpath(posixpath.join(posixpath.dirname(opf), cover))
        image = ImageOps.exif_transpose(Image.open(BytesIO(archive.read(member)))).convert('RGB')
        for width in [360, 720]:
            variant = image.copy()
            variant.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
            variant.save(output / f'{stem}-{width}.webp', 'WEBP', quality=85, method=6)
        records.append({'volume': number, 'file': f'{stem}-720.webp', 'source': source.name,
                        'epubMember': member, 'sourceSize': list(image.size),
                        'usageBasis': 'Project owner confirmed permission in conversation on 2026-10-30; not independently verified.'})
(ROOT / 'docs').mkdir(exist_ok=True)
(ROOT / 'docs/cover-sources.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
print(f'Prepared {len(records)} declared covers; no chapter content extracted.')
