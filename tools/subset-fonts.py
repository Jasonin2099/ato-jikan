# Rebuild fonts/*.woff2 after changing UI text:  python3 tools/subset-fonts.py
# Needs fontTools + brotli and Noto Sans CJK (.ttc). Keeps only the characters used by the page.
import subprocess, pathlib, string
root = pathlib.Path(__file__).resolve().parent.parent
text = ''.join((root / f).read_text() for f in ['index.html', 'i18n.js']) + string.printable + '0123456789０１２３４５６７８９・、。「」（）〜→↗×–—…％'
chars = ''.join(sorted(set(text)))
(root / 'fonts' / 'chars.txt').write_text(chars)
SRC = '/usr/share/fonts/opentype/noto/NotoSansCJK-{w}.ttc'
for lang, idx in [('JP', 0), ('SC', 2)]:
    for w in ['Regular', 'Bold']:
        out = root / 'fonts' / f'NotoSans{lang}-{w}.subset.woff2'
        subprocess.run(['pyftsubset', SRC.format(w=w), f'--font-number={idx}', f'--text-file={root/"fonts"/"chars.txt"}',
                        '--flavor=woff2', '--layout-features=kern,palt,halt,vert,locl', '--no-hinting', f'--output-file={out}'], check=True)
        print(out.name, out.stat().st_size // 1024, 'KB')
