---
# SJABLOON: dit bestand verschijnt NIET op de site (bestanden die met _ beginnen worden overgeslagen).
# Gebruik: kopieer het, geef de kopie een nieuwe naam (bv. week-3-mijn-titel.md) en vul de velden in.
# De bestandsnaam wordt de URL: week-3-mijn-titel.md → /blog/week-3-mijn-titel
# Alleen kleine letters, cijfers en streepjes in de bestandsnaam.
# Haal deze uitlegregels gerust weg in je kopie. Volledige uitleg: BLOG.md in de root van het project.

# VERPLICHT. Gebruik aanhalingstekens als de titel een dubbele punt bevat.
title: "Week 3: Titel van je post"

# VERPLICHT. Vorm JJJJ-MM-DD, met 2 cijfers voor maand en dag ("2026-10-01", niet "2026-10-1").
date: "2026-10-16"

# Optioneel. 1-2 zinnen voor de kaart, Google en social media.
# Weglaten = automatisch de eerste ~160 tekens van je tekst.
summary: "Korte samenvatting van wat je deze week deed en leerde."

# Optioneel (standaard geen tags). Kleine letters; streepje i.p.v. spatie (code-review).
tags: [code, reflectie]

# Optioneel. Zonder cover krijgt de post een standaard-cover in de stijl van de site.
# Met cover: zet de foto in public/images/blog/<post>/ en haal het # weg. De foto MOET bestaan.
# cover: /images/blog/week-3/cover.jpg
# coverAlt: "Wat er op de foto te zien is"

# Optioneel (standaard false). true = concept: niet online en niet in `npm run dev`,
# wel zichtbaar met `npm run dev:drafts`. Zet op false (of verwijder) om te publiceren.
draft: true
---

Je eerste alinea. Gewone tekst, **vet**, _cursief_ en een [link](https://example.com).

## Een tussenkop

- Een lijstje
- Met punten

> Een citaat.
>
> — Wie het zei

Inline code: `npm run dev`

```ts
// Codeblok: zet de taal achter de drie backticks (ts, tsx, js, json, bash, css, html, csharp, sql, ...)
const hello = "wereld";
```

<!--
Foto in de tekst: zet het bestand in public/images/blog/<post>/ en gebruik:
![Beschrijving van de foto](/images/blog/week-3/foto.jpg)
Alles tussen deze commentaartekens is alleen voor jou en verschijnt niet op de site.
-->
