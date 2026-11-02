from pathlib import Path
from PIL import Image, ImageOps
import json, re, html

ROOT = Path(r'D:\construction website')
OUT = ROOT / 'output/moutcha-bay-build'
ASSETS = ROOT / 'images/projects/moutcha-bay'
ASSETS.mkdir(parents=True, exist_ok=True)
files = json.loads((OUT/'media-map.json').read_text())
sources = {}
def asset(source, name, max_size=(1200,1200)):
    target = ASSETS / (name+'.webp')
    im = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    im.thumbnail(max_size)
    im.save(target, 'WEBP', quality=80, method=6)
    sources[target.relative_to(ROOT).as_posix()] = str(source)
    return target.relative_to(ROOT).as_posix()

hero = asset(r'C:\Users\maxim\AppData\Local\Temp\codex-clipboard-6d1cdaee-7221-4a95-a17a-fb614340e4c4.png','resort-hero',(1920,1280))
tree = asset(files[7], 'deck-around-tree')
cutting = asset(files[6], 'on-site-woodwork')
framing = asset(files[9], 'walkway-framing')
view = asset(files[8], 'deck-work-inlet-view')
steps = asset(OUT/'stairs-1.jpg', 'timber-steps')
landing = asset(OUT/'stairs-3.jpg', 'steps-and-landing')
railings = 'images/carpentry/moutcha-bay-railings.webp'
cabins = 'images/carpentry/moutcha-bay-cabins.webp'
installation = 'images/carpentry/moutcha-bay-deck-installation.webp'
support = 'images/carpentry/moutcha-bay-walkway-framing.webp'

def photo(src,alt):
    with Image.open(ROOT/src) as im: w,h=im.size
    return dict(src=src,alt=alt,width=w,height=h)

d = {
 'hero': {'eyebrow':'Resort Carpentry · Vancouver Island','title':'Moutcha Bay Resort','secondaryTitle':'Custom Carpentry','subtitle':'Custom timber walkways, stairs and railings around the forest cabins — woodwork fitted to a wooded hillside on Vancouver Island.','highlights':['Vancouver Island, BC','Resort / Hospitality','Custom Carpentry']},
 'galleryIntro': {'heading':'Timber Details, Up Close','text':'From the supporting frame to the deck boards and railing details, a look at our carpentry work around the forest cabins.'},
 'media': {'heroBg':hero,'gallery':[
   photo(railings,'Timber walkway and wooden railings under construction beside a forest cabin at Moutcha Bay Resort'),
   photo(support,'Carpenter working on the timber support framing beside a Moutcha Bay forest cabin'),
   photo(installation,'Deck boards being installed on a timber walkway at Moutcha Bay Resort'),
   photo(tree,'Timber decking fitted around an existing tree beside a forest cabin'),
   photo(framing,'Open timber walkway framing shaped around a tree at Moutcha Bay Resort'),
   photo(cutting,'Carpentry tools and timber being prepared on site beside the forest cabins'),
   photo(view,'Deck work area overlooking the forest and inlet at Moutcha Bay Resort'),
   photo(cabins,'Forest cabins and timber walkways among the trees at Moutcha Bay Resort')
 ],'aboutImage':photo(framing,'Timber walkway framing fitted around an existing tree on the wooded hillside'),
 'walkthrough':{'src':'images/carpentry/moutcha-bay-walkthrough.mp4','poster':steps,'label':'Site walkthrough of wooden stairs, landings, walkways and railings at Moutcha Bay Resort'},
 'finalGallery':[photo(steps,'Wooden steps leading to a timber walkway and railing beside a forest cabin'),photo(landing,'Timber steps and landing with trees and the inlet beyond at Moutcha Bay Resort')]},
 'about': {'heading':'Woodwork That Follows the Forest','para1':'At Moutcha Bay Resort, our carpentry work focused on the outdoor connections around the forest cabins: timber walkways, steps, landings and wooden railings. The layout follows the cabins and the hillside, with decking fitted around the existing trees.','para2':'The site photos follow the work from exposed timber framing and on-site cutting through to deck-board installation and railing assembly. Individual cuts around trunks, posts and cabin corners connect these separate details into one continuous timber route.'},
 'details':[{'label':'Location','value':'Moutcha Bay, Vancouver Island, BC'},{'label':'Project Type','value':'Resort / Hospitality'},{'label':'Service','value':'Custom Carpentry'},{'label':'Main Work','value':'Timber walkways, stairs, landings & railings'},{'label':'Setting','value':'Forest cabins on a wooded hillside'}],
 'scope': {'heading':'The Carpentry Scope','intro':'The work brings together the supporting timber, walking surfaces and railing details around the cabins. Each part is fitted to the changes in level and the surrounding site.','cards':[
 {'number':'01','title':'Timber Walkway Framing','text':'Supporting timber framing for the outdoor walkways and landings, shaped to follow the cabin edges and the hillside layout.'},
 {'number':'02','title':'Decking & Walking Surfaces','text':'Deck-board installation along the paths and cabin approaches, including the cuts needed around posts, corners and existing trees.'},
 {'number':'03','title':'Wooden Stairs & Landings','text':'Steps and timber landings connecting different levels along the outdoor routes beside the cabins.'},
 {'number':'04','title':'Railings & Wood Details','text':'Wooden posts, rails and vertical railing members fitted along the walkways and stair sections.'}
 ]},
 'challenge': {'heading':'Working With the Site','text':'Cabin entrances, trees and changes in ground level all influence the route. The timber work has to follow these conditions rather than repeat a single straight layout.'},
 'approach': {'heading':'Fitted on Site','text':'The framing, deck boards and railing sections were cut and assembled around the actual spaces between cabins and trees. The photos show these details taking shape throughout the work.'},
 'walkthroughIntro': {'heading':'Walk the Timber Path','text':'A short video from the site follows the stairs, landings and wooden railings around the forest cabins, with closer views of the steps and surrounding setting.'},
 'relatedServices':[{'label':'Carpentry','url':'carpentry.html','image':railings,'imageAlt':'Custom timber walkway and railings at Moutcha Bay Resort','icon':'carpentry.svg'}],
 'faq': {'items':[
 {'question':'What work did VV Renovation carry out at Moutcha Bay?','answer':'Our work shown here is the outdoor carpentry around the forest cabins: timber walkway framing, decking, steps, landings and wooden railings.'},
 {'question':'Where is Moutcha Bay Resort?','answer':'Moutcha Bay Resort is on Vancouver Island, near Gold River, on the shores of Nootka Sound in British Columbia.'},
 {'question':'How does the woodwork fit around the trees?','answer':'The decking and supporting frame follow the spaces between the cabins and existing trees. The site photos show individual cuts around trunks, changes in direction and the connections between steps, landings and walkways.'},
 {'question':'Can we discuss a similar carpentry project?','answer':'Yes. Send photos, approximate dimensions and a description of the work through the form below. VV Renovation is based in Richmond and serves Greater Vancouver; work elsewhere can be discussed individually.'}
 ]}
}
if (ROOT/'data/moutcha-bay.json').exists():
    d = json.loads((ROOT/'data/moutcha-bay.json').read_text(encoding='utf-8'))
(ROOT/'data/moutcha-bay.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'asset-sources.json').write_text(json.dumps(sources,indent=2)+'\n')
e=lambda s:html.escape(str(s),quote=True)
def img(p):return f'<img src="{e(p["src"])}" alt="{e(p["alt"])}" width="{p["width"]}" height="{p["height"]}" loading="lazy">'
def gallery(items):return ''.join('<figure class="project-gallery-item">'+img(p)+'</figure>' for p in items)
def section_heading(cls,eyebrow,h,p):return f'<div class="{cls}"><p class="project-section-eyebrow">{e(eyebrow)}</p><h2>{e(h)}</h2><p>{e(p)}</p></div>'
def scope_cards():return ''.join(f'<article class="project-scope-card"><span class="project-scope-number">{e(c["number"])}</span><h3>{e(c["title"])}</h3><p>{e(c["text"])}</p></article>' for c in d['scope']['cards'])
def faq():return ''.join(f'<div class="framing-faq-item"><button class="framing-faq-question" type="button" aria-expanded="false" aria-controls="moutcha-faq-{i}"><span>{e(q["question"])}</span><span class="framing-faq-icon" aria-hidden="true">+</span></button><div class="framing-faq-answer" id="moutcha-faq-{i}" hidden><p>{e(q["answer"])}</p></div></div>' for i,q in enumerate(d['faq']['items']))

def video_cards():
    items = []
    for i, v in enumerate(d['media']['videos']):
        cls = 'moutcha-video-card' + (' moutcha-video-card--result' if i == len(d['media']['videos'])-1 else '')
        items.append(f'<figure class="{cls}"><div class="moutcha-video-media"><video controls playsinline muted preload="none" poster="{e(v["poster"])}" aria-label="{e(v["title"])}"><source src="{e(v["src"])}" type="video/mp4"></video></div><figcaption class="moutcha-video-caption"><p class="moutcha-video-stage">{e(v["stage"])}</p><h3>{e(v["title"])}</h3><p>{e(v["description"])}</p></figcaption></figure>')
    return ''.join(items)

template=(ROOT/'jericho-beach.html').read_text(encoding='utf-8')
head=template[:template.index('<main>')]
title='Moutcha Bay Resort Carpentry Project | VV Renovation'
desc='Custom carpentry around the forest cabins at Moutcha Bay Resort on Vancouver Island: timber walkways, stairs, landings and wooden railings by VV Renovation.'
head=head.replace('Luxury Home Preparation in Jericho Beach, Vancouver | VV Renovation',title).replace('jericho-beach.html','moutcha-bay-resort.html').replace('jericho-exterior.jpg',hero)
old_desc=re.search(r'<meta name="description" content="([^"]+)"',head).group(1)
head=head.replace(old_desc,desc)
head=head.replace('Luxury Home Preparation in Jericho Beach','Moutcha Bay Resort Carpentry')
schemas=re.findall(r'<script type="application/ld\+json">.*?</script>',head,re.S)
faq_schema={'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q['question'],'acceptedAnswer':{'@type':'Answer','text':q['answer']}} for q in d['faq']['items']]}
head=head.replace(schemas[1],'<script type="application/ld+json">\n'+json.dumps(faq_schema,ensure_ascii=False,indent=2)+'\n</script>')
head=head.replace('</head>',f'<link rel="preload" as="image" href="{hero}" fetchpriority="high">\n<link rel="stylesheet" href="moutcha-bay.css?v=20261031-three-videos">\n</head>')
head=head.replace('<body class="project-page">','<body class="project-page moutcha-bay-page">')
main=f'''<main>
<section class="project-hero moutcha-bay-hero" id="project-hero">
  <div class="project-hero-overlay"></div>
  <div class="container project-hero-content">
    <p class="project-eyebrow">{e(d['hero']['eyebrow'])}</p>
    <h1 class="project-hero-title">Moutcha Bay Resort<br><span>Custom Carpentry</span></h1>
    <p class="project-hero-subtitle">{e(d['hero']['subtitle'])}</p>
    <div class="project-hero-meta" aria-label="Project highlights">{''.join('<span>'+e(s)+'</span>' for s in d['hero']['highlights'])}</div>
    <a href="#project-gallery" class="project-hero-scroll" aria-label="Scroll to project gallery"><span class="project-hero-scroll-arrow"></span></a>
  </div>
</section>
<nav class="breadcrumb" aria-label="Breadcrumb"><div class="container"><ol class="breadcrumb-list"><li><a href="index.html">Home</a></li><li><a href="our-projects.html">Our Projects</a></li><li aria-current="page">Moutcha Bay Resort Carpentry</li></ol></div></nav>
<section class="project-gallery-section" id="project-gallery"><div class="container">
  {section_heading('project-gallery-heading','Project Gallery',d['galleryIntro']['heading'],d['galleryIntro']['text'])}
  <div class="project-gallery-grid-4">{gallery(d['media']['gallery'])}</div>
</div></section>
<section class="project-about-section" id="project-about"><div class="container"><div class="project-about-grid">
  <div class="project-about-main"><div class="project-about-copy">
    <p class="project-section-eyebrow">About the Project</p><h2 id="moutcha-about-heading">{e(d['about']['heading'])}</h2>
    <p id="moutcha-about-p1">{e(d['about']['para1'])}</p><p id="moutcha-about-p2">{e(d['about']['para2'])}</p>
  </div><div class="project-about-video">{img(d['media']['aboutImage'])}</div></div>
  <aside class="project-details-card"><div class="project-details-heading"><div class="project-details-icon"><img class="project-details-icon" src="project.svg" alt="" aria-hidden="true"></div><h3>Project Details</h3></div>
    <dl class="project-details-list">{''.join('<div><dt>'+e(x['label'])+':</dt><dd>'+e(x['value'])+'</dd></div>' for x in d['details'])}</dl>
    <a href="#contact" class="project-details-btn">Discuss Similar Work</a>
  </aside>
</div></div></section>
<section class="project-scope-section" id="project-scope"><div class="container">
  {section_heading('project-scope-heading','Scope & Craftsmanship',d['scope']['heading'],d['scope']['intro'])}
  <div class="project-scope-grid">{scope_cards()}</div>
  <div class="project-before-after-detail"><div class="challenge-result-grid">
    <article class="challenge-result-card" data-project-challenge><h3>{e(d['challenge']['heading'])}</h3><p>{e(d['challenge']['text'])}</p></article>
    <article class="challenge-result-card challenge-result-card-accent" data-project-approach><h3>{e(d['approach']['heading'])}</h3><p>{e(d['approach']['text'])}</p></article>
  </div></div>
</div></section>
<section class="project-final-result-section" id="site-walkthrough"><div class="container">
  {section_heading('project-final-heading','From the Site',d['walkthroughIntro']['heading'],d['walkthroughIntro']['text'])}
  <div class="moutcha-video-grid">{video_cards()}</div>
</div></section>
<section class="project-related-services" id="related-services"><div class="container"><div class="project-related-heading"><p class="project-section-eyebrow">Explore the Service</p><h2>Carpentry for Your Next Project</h2></div><div class="project-related-service-grid">
  <a href="carpentry.html" class="project-related-service-card"><div class="project-related-service-media"><img src="{railings}" alt="Custom timber walkway and railings at Moutcha Bay Resort" loading="lazy"></div><div class="project-related-service-panel"><img class="project-related-service-icon" src="carpentry.svg" alt=""><h3>Carpentry</h3></div></a>
</div></div></section>
<section class="framing-faq project-faq" id="project-faq"><div class="container"><div class="project-faq-heading"><p class="project-section-eyebrow">Frequently Asked Questions</p><h2>Moutcha Bay Project FAQ</h2></div><div class="framing-faq-list">{faq()}</div></div></section>
'''
tail=template[template.index('<section class="contact"'):]
tail=tail.replace('js/jericho-content.js?v=20260922','js/moutcha-bay-content.js?v=20261031-three-videos')
tail=re.sub(r'    const faqItems =.*?\n  </script>', '  </script>',tail,flags=re.S)
tail=tail.replace('<li><a href="our-projects.html">All projects</a></li>','<li><a href="our-projects.html">All projects</a></li>\n              <li><a href="moutcha-bay-resort.html">Moutcha Bay Resort — Carpentry</a></li>')
page=head+main+tail
assert not re.search('jericho|whistler|yoga|estate|~1 Month',page[:page.index('<footer')],re.I)
(ROOT/'moutcha-bay-resort.html').write_text(page,encoding='utf-8')
print('Page and data created; optimized assets:',len(sources))
