"""Optional brand-asset regeneration (Pillow; macOS system fonts or DejaVu fallback).
The static site build uses the committed PNG/SVG outputs and does not require Python.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
out=Path(__file__).resolve().parent.parent/'dist/assets'
bg='#f5f3ec'; ink='#222b28'; green='#426648'; muted='#646c64'; line='#d6d9ce'
def font(size,serif=False):
    candidates=['/System/Library/Fonts/Supplemental/Georgia Italic.ttf'] if serif else ['/System/Library/Fonts/Helvetica.ttc']
    candidates+=['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
    for name in candidates:
        if Path(name).exists(): return ImageFont.truetype(name,size)
    return ImageFont.load_default(size=size)
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#f5f3ec"/><g fill="none" stroke="#426648" stroke-width="3"><rect x="18" y="18" width="28" height="28" rx="4"/><path d="M25 10v8m14-8v8M25 46v8m14-8v8M10 25h8m-8 14h8m28-14h8m-8 14h8M24 33h5l3-7 5 13 3-6"/></g></svg>'
(out/'favicon.svg').write_text(svg)
im=Image.new('RGB',(180,180),bg);d=ImageDraw.Draw(im)
d.rounded_rectangle((47,47,133,133),radius=13,outline=green,width=6)
for t in (69,110):
    d.line([(t,24),(t,47)],fill=green,width=6);d.line([(t,133),(t,156)],fill=green,width=6)
    d.line([(24,t),(47,t)],fill=green,width=6);d.line([(133,t),(156,t)],fill=green,width=6)
d.line([(64,94),(78,94),(88,74),(103,110),(114,92)],fill=green,width=5)
im.save(out/'apple-touch-icon.png',optimize=True)
im=Image.new('RGB',(1200,630),bg);d=ImageDraw.Draw(im)
d.text((70,53),'AMLESH SAHOO',font=font(24),fill=green)
d.line((70,105,1130,105),fill=line,width=2)
d.text((65,154),'From circuit.',font=font(88),fill=ink)
d.text((65,258),'To system.',font=font(94,True),fill=green)
d.text((70,425),'Electrical & Embedded Systems',font=font(30),fill=ink)
d.text((70,481),'PCB design  /  Firmware  /  Data acquisition',font=font(24),fill=muted)
d.text((70,563),'buffer-cloud.github.io',font=font(20),fill=muted)
d.ellipse((845,180,1115,450),outline=line,width=2)
d.rounded_rectangle((930,265,1030,365),radius=16,outline=green,width=3)
for t in (955,980,1005):
    d.line([(t,249),(t,265)],fill=green,width=2);d.line([(t,365),(t,381)],fill=green,width=2)
d.line([(945,319),(962,319),(972,299),(990,334),(1001,315),(1017,315)],fill=green,width=3)
im.save(out/'social-card.png',optimize=True)
