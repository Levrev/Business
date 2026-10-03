# LK Systems — Batch 2 (Southport / Burleigh Waters): recon + outreach

Same setup as batch 1 (see `OUTREACH.md`): one folder per business, each a standalone static site you can drop into Netlify. Every form uses Netlify Forms (`data-netlify="true"` + honeypot), so submissions and email alerts work once deployed.

| # | Business (as you wrote it) | Correct name / status | Folder |
|---|---|---|---|
| 1 | Modfitness 24/7 (improved website) | **MOD Fitness 24/7** · Burleigh Waters | `mod-fitness-247/` |
| 2 | Assah (Instagram) | **Assah 앗싸** · Korean · Southport | `assah/` |
| 3 | Milestone Café | **Milestone Café & Kitchen** · Southport | `milestone-cafe/` |
| 4 | Zhangliang Malatang | **Zhangliang Malatang** · Australia Fair Metro | `zhangliang-malatang/` |
| 5 | Haeduri Chicken (improved website) | **Haeduri Chicken Southport (Young St)** | `haeduri-chicken/` |
| 6 | Hazel Expresso | **Hazel Espresso** (spelling) · Southport | `hazel-espresso/` |
| 7 | You & m Tea Shop | **You & M Tea Shop** · Southport | `you-and-m-tea-shop/` |
| 8 | Maruya Japanese Resturaunt | **Maruya Japanese Restaurant** · Southport | `maruya-japanese-restaurant/` |

## Open or closed?

I found **no evidence that any of the eight has closed**, so all eight have a site. Caveat: I can't see Google Maps' "Permanently closed" flag from here, so **spot-check each on Google Maps before sending a DM** (30 seconds each). Recent activity I saw: Maruya (Yelp page updated March 2026), Hazel Espresso (current Tripadvisor/OpenTable listings), Milestone (opened 2025, Inside Gold Coast feature), Zhangliang (Australia Fair Metro Lunar New Year 2025 feature), Haeduri Southport (Uber Eats, 4.8★ / 370+ ratings). Assah, You & M and MOD Fitness had current directory listings but less dated evidence — check those three first. If one has closed, delete its folder.

## ⚠️ Things I couldn't verify (flagged on the pages as sample/"confirm")

- **I couldn't open the existing MOD Fitness or Haeduri websites** (blocked from my sandbox). The "improved" versions are built from public listing facts, not from a teardown of their current sites. In the two DMs below there is a `[ADD ONE SPECIFIC THING YOU NOTICED]` slot — open their live site for 2 minutes and fill it in so the "bottleneck" line is true and specific.
- **MOD Fitness:** two phone numbers appear in listings — I used the one on their own site, **(07) 5535 3754**; another listing shows 0435 268 375. An older listing also placed it in Varsity Lakes; current listings say Shop 9, 1 Santa Maria Court, **Burleigh Waters**. Membership prices ($15.95 flexi / $12.95 12-mth / $10.95 18-mth per week) come from public search snippets — confirm.
- **Hours:** Zhangliang (weekends only found: 11:30am–9pm — weekdays shown as TBC on the page), Haeduri (not found — page says "check Uber Eats"), Assah / Maruya / Hazel / You & M / Milestone from directory listings.
- **Phones:** Maruya (07) 5527 1199 and Milestone 0452 420 666 are from listings. No phone found for Assah, Zhangliang, Hazel, You & M or Haeduri (pages use Instagram/Facebook/Uber Eats or directions instead).
- **Menu prices are sample prices** everywhere (labelled on each page) — I couldn't find real price lists. Only dish *names* that appear in public listings/reviews are presented as signature dishes.
- Footer line on every page: *"Concept design by LK Systems — not the business's live site."* + "Sample menu & pricing for illustration." Keep it. No logos/photos/trademarks of the businesses are used.

---

## STEP 1 — Reconnaissance & architecture

### 1. MOD Fitness 24/7 — *improved website*
- **Demographic:** shift workers, tradies, parents and students in Burleigh/Gold Coast south who want cheap, no-fuss 24-hour training.
- **Palette:** near-black `#0b0c0e`, volt green `#c8ff2e`, white — athletic, high contrast.
- **Address/hours:** Shop 9, 1 Santa Maria Court, Burleigh Waters QLD 4220 · member access 24/7 · staffed hours TBC.
- **USP:** *A 24-hour gym with premium Life Fitness and Hammer Strength gear and memberships from $10.95 a week — train on your terms.*
- **Page extras:** membership cards with a plan picker that pre-fills the join form.

### 2. Assah 앗싸 (Instagram-only)
- **Demographic:** Southport locals, office workers on lunch, K-food fans, families.
- **Palette:** hanji cream, gochujang red `#b3271c`, charcoal, gold.
- **Address/hours:** 51 Johnston St, Southport QLD 4215 · Tue–Fri 11–3 & 5–9 · Sat–Sun 11:30–3 & 5–9 · Mon closed.
- **USP:** *Home-style Korean cooking — bulgogi, bibimbap and bubbling stews with banchan — in the heart of Southport.*
- **Page extras:** filterable menu (rice / stews / combos), table booking form, Instagram link (@assah_banchan).

### 3. Milestone Café & Kitchen
- **Demographic:** 20–40 cafe-goers, Instagram-driven brunch crowd, Korean/Asian dessert fans, celebration bookings.
- **Palette:** cream, walnut `#6f4a31`, sage/matcha green, terracotta — warm mid-century.
- **Address/hours:** C001/56 Scarborough St, Southport QLD 4215 · daily 7am–2pm · 3 hours free parking.
- **USP:** *Seoul-inspired croffles, matcha and silky lattes in a warm mid-century Southport café — every cup a small milestone.*
- **Page extras:** reservation / celebration-stack pre-order form.

### 4. Zhangliang Malatang
- **Demographic:** students, young adults and Asian-food fans at Australia Fair; groups sharing a DIY meal.
- **Palette:** chilli red `#d2301f`, black, gold, cream — street-food energy.
- **Address/hours:** Shop M006, Australia Fair Metro, 6 Young St, Southport QLD 4215 · weekends 11:30am–9pm (weekdays TBC).
- **USP:** *Build your own bowl from 100+ fresh ingredients, weighed and cooked in the broth you choose — hot in minutes.*
- **Page extras:** interactive "plan your bowl" tool (broth, spice, ingredients) that drops into the group enquiry form.

### 5. Haeduri Chicken (Southport) — *improved website*
- **Demographic:** students, families and late-night snackers; heavy delivery-app users in Southport.
- **Palette:** sun orange `#ff6a00`, black, butter yellow — loud, appetite-driven.
- **Address/hours:** 6 Young St (Australia Fair Metro), Southport QLD 4215 · hours TBC (see Uber Eats).
- **USP:** *Crunchy Korean fried chicken, fried to order and tossed in sweet soy, spicy garlic or golden cheese — ready for pickup in Southport.*
- **Page extras:** flavour picker + cart that fills a pickup order form, sticky mobile Order/Map bar, Uber Eats link.

### 6. Hazel Espresso
- **Demographic:** brunch crowd 22–45, coffee nerds, Vietnamese-coffee fans, weekend couples.
- **Palette:** olive `#4f5b2f`, cream, coral `#e8573c`, hazel brown.
- **Address/hours:** 9 Davenport St, Southport QLD 4215 · Mon–Fri 7–2:30 · Sat–Sun 7–2.
- **USP:** *Australian brunch with a Vietnamese heart — ST. ALi coffee, banh mi and chilli crab croissants on Davenport Street.*
- **Page extras:** brunch table-booking form, scrolling ticker of signature dishes.

### 7. You & M Tea Shop
- **Demographic:** students and friend groups, after-school/after-work evening crowd (open until 9–10pm).
- **Palette:** deep teal `#10413b`, lilac, mint, cream — calm, "evening hangout".
- **Address/hours:** 26 Davenport St, Southport QLD 4215 · Mon–Thu 12–9 · Fri–Sat 12–10 · Sun 12–9:30.
- **USP:** *A cosy late-night corner for jasmine milk tea, grape green tea with real jelly and sparkling teas.*
- **Page extras:** "Tea finder" vibe picker, group/party spot request form.

### 8. Maruya Japanese Restaurant
- **Demographic:** Japanese-food fans, anime/mecha fans, date-night and group diners near Australia Fair.
- **Palette:** navy `#0f1724`, hazard orange `#ff5a1f`, cyan — mecha/anime HUD styling echoing the restaurant's figures.
- **Address/hours:** 15 Davenport St, Southport QLD 4215 · Mon–Sat 11:30–3 & 5–9 · Sun closed · (07) 5527 1199.
- **USP:** *Real Japanese sashimi, wagyu don and soba — in a dining room packed with mecha figures and movie posters.*
- **Page extras:** filterable menu, table booking form.

---

## STEP 3 — Cold outreach DMs

> Replace `[NETLIFY LINK]` / `[VIDEO LINK]`. One send each; one follow-up after 3–4 days max. Spot-check each business is still open on Google Maps first.

### MOD Fitness 24/7 (improved website)

Hi MOD Fitness team 👋

I'm Levi, a local web designer. MOD's 24/7 access, Life Fitness/Hammer Strength gear and memberships from $10.95/wk are a strong offer for Burleigh Waters. **[ADD ONE SPECIFIC THING YOU NOTICED ON THEIR LIVE SITE — e.g. plans are hard to compare on mobile / no quick join form]** — and I think a faster, mobile-first page that puts the plans and an enquiry form front and centre could turn more visitors into members.

I built a refreshed concept to show what I mean:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

It's only a concept — not your live site — so no pressure, but I'd be happy to tailor it with your real branding and photos.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### Assah (Instagram)

Hi Assah team 👋

I'm Levi, a local web designer. I came across Assah on Johnston Street in Southport — the bibimbap and bulgogi look great on your Instagram (@assah_banchan). The bottleneck I noticed is that Instagram and delivery apps are the main places people can find you, so there's no single page with your menu, hours and a way to book a table.

I put together a concept homepage with a filterable menu and a booking form:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

It's just a concept — not your live site — but happy to customise it with your real menu and photos if it's useful.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### Milestone Café & Kitchen

Hi Selena & the Milestone team 👋

I'm Levi, a local web designer. Milestone's croffles and matcha on Scarborough Street in Southport look so good — I love the "every cup is a milestone" idea. I couldn't find a website beyond Instagram, which means people planning a catch-up or birthday can't easily see your menu, hours or book a table / pre-order a celebration stack.

I made a concept site in a warm mid-century style with a reservation form:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

Just a concept, not your live site — but if you like it I'd love to tailor it with your real menu and photos.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### Zhangliang Malatang

Hi Zhangliang Malatang team 👋

I'm Levi, a local web designer. Your DIY malatang at Australia Fair Metro in Southport is such a fun concept — but first-timers often don't know how it works (bowl, tongs, weigh, broth), and I couldn't find a website of your own with your broths, hours and a way to enquire about groups.

I built a concept page with a "plan your bowl" tool and a group enquiry form:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

It's just a concept — not your live site — but happy to adapt it with your real ingredients, prices and branding.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### Haeduri Chicken Southport (improved website)

Hi Haeduri Chicken team 👋

I'm Levi, a local web designer. Your Southport store at Australia Fair Metro has fantastic ratings (4.8★ on Uber Eats). **[ADD ONE SPECIFIC THING YOU NOTICED — e.g. the Southport store mostly turns up on delivery apps / no direct pickup ordering for Southport]** — and every delivery-app order costs you a cut, so a fast direct-order page could help keep more of that revenue.

I built a refreshed concept with a flavour picker, a tap-to-add order that sends straight to you, and a sticky mobile order bar:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

It's a concept only — not your live site — but happy to tailor it with your real menu and branding.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### Hazel Espresso

Hi Hazel Espresso team 👋

I'm Levi, a local web designer. Hazel on Davenport Street in Southport is a standout — the chilli crab croissant and Vietnamese coffee are exactly what makes you different. I couldn't find a website of your own, only Facebook and third-party listings, so people can't easily see your full menu, hours or request a brunch table in one place.

I put together a concept homepage with a menu and booking request form:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

It's just a concept — not your live site — but I'd be happy to tailor it with your real menu and photos.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### You & M Tea Shop

Hi You & M team 👋

I'm Levi, a local web designer. Your tea shop on Davenport Street in Southport has such a cosy vibe — and being open until 9–10pm is a real advantage. I couldn't find a website of your own, just delivery-app and directory listings, so people can't easily see your full menu or ask about a spot for a group.

I made a concept with a "tea finder" and a group-booking request form:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

Just a concept, not your live site — but happy to tailor it with your real menu and branding if you like it.

L. Keijer | LK Systems | WhatsApp: 0414 918 510

### Maruya Japanese Restaurant

Hi Maruya team 👋

I'm Levi, a local web designer. Maruya on Davenport Street in Southport is one of the most distinctive Japanese restaurants on the Gold Coast — the mecha figures and posters alone are a talking point. The bottleneck I noticed is that I couldn't find a site that shows that personality alongside your menu, hours and an easy way to request a table.

I put together a concept with a mecha-inspired look, a filterable menu and a booking form:

🔗 Preview: [NETLIFY LINK]
🎥 60-second walkthrough: [VIDEO LINK]

It's only a concept — not your live site — but I'd love to tailor it with your real menu and photos.

L. Keijer | LK Systems | WhatsApp: 0414 918 510
