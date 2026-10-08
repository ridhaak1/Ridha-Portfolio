---
title: "Week 3: Opmerkingen, een timer en een toetsenbord dat steeds dichtklapte"
date: "2026-10-08"
summary: "Deze week kon je in de app opmerkingen bewerken bij orders, facturen en timers. En ik vond eindelijk waarom het toetsenbord bij het zoeken steeds dichtklapte."
tags: [code, react-native, reflectie]
draft: false
---

Vorige week ging alles over rechten: welke gebruiker mag wat zien. Deze week had ik geen grote taak, maar vier kleinere. Drie ervan gingen over hetzelfde: **opmerkingen** (comments). De vierde was een bug die me echt een tijdje bezighield.

## Taak 1: opmerkingen bij een order

Een order heeft twee opmerkingen: een **interne** (alleen voor ons) en een **externe** (voor de klant). Op de website kon je die al aanpassen, in de app nog niet.

Nu kan het wel. In het scherm van een order staan twee editors waarin je tekst kan opmaken (vet, lijstjes, ...). Je past iets aan, je drukt op "Opslaan" en de app laadt de opmerkingen opnieuw.

```
Scherm openen → opmerkingen ophalen → 2 editors tonen
             → Opslaan → opmerkingen versturen → opnieuw ophalen
```

Voor het versturen maakte ik een nieuwe functie `postComment`. Ik moest niet van nul beginnen: er bestond al een functie om een handtekening te versturen (`postSignature`), en die heb ik als voorbeeld gebruikt.

Onderweg liep ik tegen een paar dingen aan.

**De editor leest de tekst maar één keer.** Als je de editor toont voor de data binnen is, blijft hij leeg, ook als de tekst daarna toch binnenkomt. Daarom toon ik eerst een laad-icoontje en pas daarna de editors:

```tsx
if (!comments) return <ActivityIndicator />;
```

**Altijd beide opmerkingen meesturen.** Ik vul de editors met de tekst die er al stond. Zo stuur ik bij het opslaan altijd de interne én de externe opmerking mee. Stuur je er maar één, dan kan de andere per ongeluk gewist worden.

**`fetch` gooit geen fout bij een serverfout.** Dat wist ik eerlijk gezegd niet. Als de server een 400 of 500 terugstuurt, denkt je code gewoon dat alles goed ging. Je moet het zelf controleren:

```ts
if (!response.ok) {
  throw new Error(`Opslaan mislukt: ${response.status}`);
}
```

De knop heeft ook een status (`idle`, `sending`, `sent`, `error`), zodat de gebruiker ziet wat er gebeurt. Tijdens het versturen kan je er niet nog eens op drukken.

## Taak 2: hetzelfde voor facturen

Facturen hebben dezelfde twee opmerkingen. Omdat de order-versie al werkte, ging dit veel sneller. Ik kopieerde het scherm en veranderde twee dingen: de store (waar de data van facturen zit) en de discriminator (`INVOICE` in plaats van `ORDER`). Zo weet de backend over welk soort ding het gaat.

## Taak 3: een timer stoppen met opmerkingen

In de app kan je een timer starten op een taak. Als je hem stopt, komt er een venstertje. Daar stond eerst één gewoon tekstveld. Op de website heb je daar twee editors (intern en voor de klant) en een schakelaar **Billable** (moet dit gefactureerd worden of niet). Dat moest in de app ook komen.

Het stoppen gebeurt nu in twee stappen:

```
"Stop timer" → 1. timer stoppen
             → 2. opmerkingen + billable versturen (discriminator TIMER)
             → timers opnieuw laden → venster dicht → formulier leegmaken
```

Ik kon `postComment` van taak 1 opnieuw gebruiken. Ik heb er alleen `billable` aan toegevoegd en de opmerkingen optioneel gemaakt. Orders en facturen merken daar niets van.

Ook hier waren er een paar valkuilen:

- **Eerst het id bewaren, dan pas stoppen.** Na het stoppen laadt de app de timers opnieuw, en dan is de lopende timer weg. Ook zijn id dus. Daarom bewaar ik het id vóór ik iets doe.

  ```ts
  const timerUuid = runningTimer.uuid; // eerst bewaren!
  ```

- **Een "lege" editor is niet echt leeg.** Als je niets typt, geeft de editor toch iets als `<p><br></p>` terug. Een klein hulpfunctietje zorgt dat zoiets niet verstuurd wordt.
- **Een eigen foutmelding.** Als de timer wel gestopt is maar de opmerking niet verstuurd kon worden, krijgt de gebruiker daar een duidelijke melding over. Niet gewoon "er ging iets mis".
- **Het toetsenbord.** Met twee editors werd het venster te groot. Nu kan je erin scrollen, schuift het mee met het toetsenbord en blijven de knoppen altijd zichtbaar.

De teksten in het venster heb ik ook meteen naar het Nederlands vertaald.

## Taak 4: het toetsenbord dat steeds dichtklapte

Bij Taken kan je zoeken. Twee problemen:

1. Er was geen vinkje **"Alleen actief"**, terwijl de Zoeken-tab dat wel had.
2. Telkens je een letter typte, klapte het toetsenbord dicht. Heel irritant.

Het vinkje was niet zo moeilijk. De zoekfunctie `searchEntity` wordt op 8 andere plaatsen gebruikt. Daarom zette ik de nieuwe parameter `active` **achteraan** en maakte ik hem optioneel. Zo moest ik die 8 andere plekken niet aanpassen.

Het toetsenbord was het echte raadsel. Uiteindelijk zat het probleem in één regel:

```tsx
editable={!loading}
```

Tijdens het laden werd het zoekveld heel even "niet bewerkbaar". Daardoor verloor het de focus, en dan sluit het toetsenbord. En omdat er na elke letter gezocht wordt, gebeurde dat dus na elke letter.

Ik vond het door de Zoeken-tab erbij te nemen, waar het wel goed werkte. Die regel stond daar niet. Ik heb hem weggehaald en het probleem was weg.

## Wat nog openstaat

Ik ben nog niet helemaal klaar:

- Ik moet bij de backend nog nagaan of de URL voor het opslaan juist is voor orders, facturen en timers. En of het filter "alleen actief" werkt bij het zoeken op taken.
- Ik heb alleen de opmerkingen bij orders echt op de telefoon getest. Facturen, het timer-venster en het zoeken bij Taken nog niet.
- Ik zag een risico: als de server een lege lijst terugstuurt bij het ophalen van de opmerkingen, crasht de code en blijft het scherm eeuwig laden. Dat moet nog opgelost worden.

## Wat ik geleerd heb

- **Kijk naar wat al werkt.** De handtekening hielp me bij het versturen, de Zoeken-tab hielp me de bug vinden. Vaak staat het antwoord al ergens in het project.
- **`fetch` en fouten:** een 500 is voor `fetch` geen fout. Altijd `response.ok` controleren.
- **Volgorde is belangrijk.** Bewaar wat je nodig hebt vóór je iets verandert, zoals het id van de timer.
- **Nieuwe parameter achteraan en optioneel**, dan maak je de bestaande code niet kapot.
- **"Het compileert" is niet hetzelfde als "het werkt".** Ik moet dit nog op de telefoon testen voor ik kan zeggen dat het af is.

## Volgende week

Eerst alles op de telefoon testen en mijn vragen aan de backend stellen. Daarna wil ik de crash bij een lege lijst oplossen, zodat het opmerkingen-scherm niet blijft hangen.
