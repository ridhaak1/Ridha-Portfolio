# Stageblog — handleiding

Hoe je een nieuwe post toevoegt aan `/blog`. Alles op de blog is Nederlands.

## In het kort

1. Kopieer `content/blog/_template.md` en geef de kopie een nieuwe naam, bv. `week-3-mijn-titel.md`.
2. Vul minstens `title` en `date` in, en schrijf je tekst in Markdown.
3. Optioneel: zet foto's in `public/images/blog/week-3/`.
4. Bekijk de post met `npm run dev` (of met `npm run dev:drafts` zolang hij een concept is).
5. Zet `draft: false`, run `npm run build` en controleer dat de build slaagt.

## 1. Bestand en URL

- Posts staan in **`content/blog/`** en eindigen op **`.md`**.
- **De bestandsnaam wordt de URL**: `week-3-mijn-titel.md` → `/blog/week-3-mijn-titel`.
- Gebruik alleen **kleine letters, cijfers en streepjes**, dus geen spaties, hoofdletters of accenten.
- Hernoem een bestand niet meer nadat het online staat, want dan verandert de link.
- Bestanden die met **`_`** beginnen (zoals `_template.md`) worden overgeslagen.

## 2. Frontmatter

Bovenaan elk bestand staat een blok tussen `---` en `---`:

```yaml
---
title: "Week 3: Mijn titel"
date: "2026-10-16"
---
```

Dat is het minimum. Alle velden:

```yaml
---
title: "Week 3: Mijn titel"
date: "2026-10-16"
summary: "Eén of twee zinnen over deze week."
tags: [code, reflectie]
cover: /images/blog/week-3/cover.jpg
coverAlt: "Wat er op de foto staat"
draft: false
---
```

| Veld | Verplicht | Betekenis | Als je het weglaat |
|---|---|---|---|
| `title` | **ja** | Titel van de post. **Gebruik aanhalingstekens** als er een `:` in staat. | Fout |
| `date` | **ja** | `JJJJ-MM-DD`, altijd **2 cijfers** voor maand en dag: `"2026-10-01"`, niet `"2026-10-1"`. Bepaalt de volgorde. | Fout |
| `summary` | nee | 1–2 zinnen voor de kaart, Google en social media. | De eerste ~160 tekens van je tekst |
| `tags` | nee | Lijst met tags. | Geen tags |
| `cover` | nee | Pad naar de cover-foto, beginnend met `/`. Is ook de preview bij delen op social media. | Een standaard-cover in de stijl van de site ("RIDHA_" + titel); bij delen je algemene site-afbeelding |
| `coverAlt` | nee | Beschrijving van de cover voor schermlezers. | Geen beschrijving |
| `draft` | nee | `true` = concept, niet online. | `false` (gepubliceerd) |

De leestijd ("4 min lezen") wordt automatisch berekend.

## 3. Foto's

**Waar:** zet ze in **`public/images/blog/<naam-van-je-post>/`**, met één map per post, bv. `public/images/blog/week-3/`.

**Verwijzen** doe je altijd met een pad dat begint met `/images/...`, dus zonder `public`:

```markdown
cover: /images/blog/week-3/cover.jpg          ← in de frontmatter

![Beschrijving van de foto](/images/blog/week-3/dashboard.png)   ← in de tekst
```

**Formaat en grootte**

| | Aanbevolen |
|---|---|
| Cover | **Liggend**, 1600 × 900 px (16:9). `.jpg` of `.webp`, liefst **onder 300 KB**. |
| Foto in de tekst | Max. **1600 px breed**. `.jpg`/`.webp` voor foto's, `.png` voor screenshots met tekst. Liefst onder 300 KB. |

- Geen geschikte foto? Laat `cover` gewoon weg, dan krijg je de standaard-cover.
- De cover wordt altijd **bijgesneden tot 16:9** (op mobiel tot 4:3), met de nadruk op het bovenste derde. Bij een staande foto valt dus een deel weg.
- **Foto's worden niet automatisch kleiner gemaakt of omgezet.** Ze worden geserveerd zoals je ze aanlevert. Verklein ze dus vooraf, bijvoorbeeld met [squoosh.app](https://squoosh.app) (gratis, in de browser).
- Wel automatisch: foto's in de tekst krijgen hun afmetingen mee en laden pas als je ernaartoe scrolt.

## 4. Codeblokken

Zet de taal direct achter de drie backticks:

````markdown
```ts
const hello: string = "wereld";
```
````

Veelgebruikte talen: `ts`, `tsx`, `js`, `jsx`, `json`, `bash`, `css`, `html`, `csharp`, `sql`, `yaml`, `diff`.
Zonder taal, of met een onbekende taal, verschijnt het blok gewoon als platte tekst, zonder kleuren en zonder foutmelding.
Inline code schrijf je met enkele backticks: `` `npm run dev` ``.

## 5. Concepten (draft)

- Met **`draft: true`** staat de post **niet** op de site: niet in het overzicht, en hij krijgt geen eigen pagina bij `npm run build`.
- Gewoon `npm run dev` toont hem ook niet.
- Wil je je concept toch lokaal bekijken, gebruik dan **`npm run dev:drafts`**. Concepten staan daar met **"[Concept]"** voor de titel. Dat zie je alleen lokaal, nooit online.
- Klaar om te publiceren? Zet `draft: false` (of haal de regel weg).
- Een concept wordt bij `npm run build` **niet gecontroleerd**: een half afgewerkt concept met een ontbrekende foto houdt de build dus nooit tegen.
- Let op: het sjabloon staat standaard op `draft: true`. Zie je je nieuwe post niet in `npm run dev`? Kijk dan eerst naar `draft`.

## 6. Lokaal bekijken

```bash
npm run dev          # http://localhost:5173/blog  (alleen gepubliceerde posts)
npm run dev:drafts   # idem, maar ook concepten
```

Nieuwe of gewijzigde posts zie je na het **verversen** van de pagina. Je hoeft de server niet te herstarten.

Controle voor je publiceert (precies zoals de site online wordt opgebouwd):

```bash
npm run build        # moet slagen zonder fouten
npm run preview      # http://localhost:4173/blog
```

## 7. Tags

- Je mag **zelf nieuwe tags maken**: zet ze gewoon in `tags`. Ze verschijnen automatisch in de filter op `/blog`.
- Tags worden omgezet naar kleine letters, en spaties worden streepjes: `Code Review` → `code-review`.
- Gebruik liever bestaande tags, zodat het filter overzichtelijk blijft. Ze staan op `/blog` boven de posts.
- Huidige tags (alleen gepubliceerde posts):
  - `reflectie`, `teambuilding`, `code` (week 1)
  - `feature`, `code-review`, `frontend` (alleen in de tijdelijke mock-post "Week 2")

## 8. Foutmeldingen

De blog is **soepel tijdens `npm run dev`** en **streng bij `npm run build`**.

**Tijdens `npm run dev`** breekt een fout de blog niet:
- De post verschijnt gewoon, met een **rode waarschuwingsbalk** op de kaart en op de postpagina die zegt wat er mis is.
- Dezelfde melding staat in de terminal (geel, met ⚠).
- Ontbrekende of foute onderdelen worden tijdelijk opgevangen: geen titel → de bestandsnaam, foute datum → "Datum ontbreekt" (de post komt onderaan), foto niet gevonden → de standaard-cover.

**Bij `npm run build`** stopt de build bij een echte fout in een gepubliceerde post, met een Nederlandse melding die het bestand noemt:

| Fout | Melding |
|---|---|
| Datum in de verkeerde vorm | `[blog] week-3.md: `date` "2026-10-1" moet de vorm JJJJ-MM-DD hebben, bv. date: "2026-10-01"` |
| Datum bestaat niet | `[blog] week-3.md: `date` "2026-13-45" bestaat niet` |
| Titel of datum ontbreekt | `[blog] week-3.md: `title` ontbreekt` |
| Cover opgegeven maar niet gevonden | `[blog] week-3.md: cover-afbeelding niet gevonden: public/images/blog/week-3/cover.jpg` |
| Foto in de tekst niet gevonden | `[blog] week-3.md: afbeelding in de tekst niet gevonden: public/images/blog/week-3/foto.png` |
| Foute bestandsnaam | `[blog] Week 3.md: ongeldige bestandsnaam. Gebruik alleen kleine letters, cijfers en streepjes…` |
| `:` in titel zonder aanhalingstekens | `[blog] week-3.md: de frontmatter is geen geldige YAML: …` |

**Geen** fout: een ontbrekende `cover`, `summary` of `tags`, en alles in een concept (`draft: true`).

**Tip:** zie je in `npm run dev` geen rode balken, dan slaagt de build ook (voor zover het de blog betreft).

Let op: een link naar een **externe** website wordt niet gecontroleerd.

## 9. Notities voor jezelf

Alles tussen `<!--` en `-->` in je tekst is alleen voor jou en verschijnt niet op de site. Foto-paden daarin worden ook niet gecontroleerd.
