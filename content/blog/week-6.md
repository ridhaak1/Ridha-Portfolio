---
title: "Week 6: Een AI-agent veilig maken met permissions en Row Level Security"
date: "2026-11-05"
summary: "Deze week leerde ik een AI-agent grenzen te geven: welke tools hij mag gebruiken, en welke data hij mag zien. Ik testte alles stap voor stap en vond onderweg een verborgen fout in de databank."
tags: [ai, java, spring-boot, postgresql, beveiliging, reflectie]
cover: /images/blog/week-6/cover.png
coverAlt: "Een AI-assistent met afgeschermde tools, verbonden via een beveiligingsschild met een databank die met een slot beschermd is"
draft: false
---

Deze week draaide alles rond één vraag: **hoe zorg je dat een AI-agent alleen doet wat hij mag?** Een agent die bestanden kan lezen, commando's kan uitvoeren en een databank kan bevragen, is krachtig. Maar zonder grenzen is hij ook gevaarlijk.

## Taak 1: permissions voor de agent

Onze server ontvangt vragen via een REST-API en laat Claude ze uitvoeren. Mijn begeleider wilde dat de app per vraag kan kiezen:

- in welke **mode** de agent werkt, bv. `plan` (alleen plannen, niets aanpassen) of `dontAsk` (alles wat niet toegelaten is, wordt geweigerd);
- welke **tools** de agent mag gebruiken (`allowedTools`) en welke nooit (`disallowedTools`).

Eerst moest ik het verschil begrijpen tussen twee SDK's van Anthropic. Onze Java-server gebruikte de _Client SDK_: daarmee stel je Claude een vraag, maar permissions en plan mode moet je zelf bouwen. De _Agent SDK_ en de Claude CLI hebben dat allemaal ingebouwd. We kozen een tussenweg: de Java-server blijft het loket, en start voor elke vraag de Claude CLI met de juiste instellingen.

```java
// De velden uit de request worden vlaggen voor de CLI
command.add("--permission-mode=" + mode);
command.add("--allowedTools=" + String.join(",", allowedTools));
```

Het mooiste moment was de test: ik gaf de agent alleen leesrechten en vroeg hem een bestand te verwijderen. Hij probeerde het, kreeg een weigering, en antwoordde zelf dat hij het niet mocht. Het bestand bestond nog.

### Wat ik leerde over veiligheid

- **Vertrouw invoer niet.** Een prompt die begint met `--dangerously-skip-permissions` kon door de CLI als instelling gelezen worden. Ik geef de prompt daarom via _stdin_ mee, zodat hij altijd gewone tekst blijft.
- **Controleer elk veld.** Een gebruiker mag zichzelf geen extra rechten geven, dus de mode `bypassPermissions` wordt geweigerd met een `400`.
- **Lees de documentatie, maar test zelf.** De CLI kende de mode `default` niet, terwijl wij die wel aanvaardden. Dat zag ik pas door het met de hand te proberen.

## Taak 2: Row Level Security in PostgreSQL

Meerdere klanten delen dezelfde databank. Elke klant mag alleen zijn eigen rijen zien. Dat regelt PostgreSQL met **Row Level Security (RLS)**: per tabel een _policy_ die bepaalt welke rijen een gebruiker ziet.

Ik leerde dat dat werkt als een ketting. Alleen de centrale tabel kent het domein van een rij. Een bankrekening hoort bij een bedrijf, en een bedrijf bij die centrale tabel. De policy van de bankrekening zegt dus alleen: _"je ziet deze rij als je het bedrijf ook mag zien"_.

Mijn test was eenvoudig maar overtuigend:

```sql
-- als beheerder: hoeveel rijen HOORT de klant te zien?
select count(*) from bank_account ba
join entity en on en.id = ba.company_id
where en.domain_id = <klant>;

-- als de klant zelf, zonder filter: hoeveel ziet hij ECHT?
set role <klant_user>;
select count(*) from bank_account;
reset role;
```

Beide getallen waren gelijk, terwijl er duizenden rijen van andere klanten in de tabel stonden. En als de klant iets probeerde aan te passen, kreeg hij `permission denied`.

### Een verborgen fout

De policies worden gemaakt door een script dat zelf de weg zoekt via de foreign keys. Bij één tabel had het script de **verkeerde** weg gekozen. Iemand had dat in de databank al met de hand verbeterd, maar het script zelf niet. Zou iemand het script opnieuw draaien, dan kwam de fout stil terug.

De oorzaak: bij twee even lange wegen koos het script gewoon de tabel die het eerst gemaakt was, niet de logische. Ik voegde een uitzondering toe en schreef een installatiebestand, zodat mijn begeleider de opzet stap voor stap op een andere databank kan toepassen.

## Reflectie

- **Begrijpen voor bouwen.** De tijd die ik stak in het verschil tussen de twee SDK's, bespaarde later veel werk.
- **Kleine stappen.** Na elke stap testen: compileren, de tests draaien, een request in Postman. Zo wist ik meteen waar iets misging.
- **Een testgetal moet iets kunnen bewijzen.** "0 = 0" bewijst niets. Pas toen ik zag dat er data van veel klanten was, wist ik dat mijn RLS-test echt iets aantoonde.
- **Niet alles werkt zoals verwacht.** Zo startte de container plots niet meer: een bestand had na een verhuizing de verkeerde groep gekregen. Foutmeldingen rustig lezen hielp me de oorzaak te vinden.

Volgende week werk ik verder aan het geheugen van de agent, zodat hij in een gesprek ook de vorige vragen meekrijgt.
