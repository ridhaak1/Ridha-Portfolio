---
title: "Week 5: mijn eerste Maestro-tests en een handleiding voor releases"
date: "2026-10-23"
summary: "Deze week schreef ik mijn eerste end-to-end tests met Maestro op een echte Android-gsm, en maakte ik een stap-voor-stap handleiding om de app te publiceren op Google Play en de App Store."
tags: [testen, react-native, expo, documentatie, reflectie]
draft: false
---

Deze week had ik twee grote opdrachten: **tests schrijven** voor de mobiele app van mijn
stagebedrijf, en een **handleiding maken** om nieuwe versies van de app te publiceren.
Twee heel verschillende taken, maar bij allebei leerde ik veel over hoe een mobiele app
echt in elkaar zit.

## Opdracht 1: end-to-end tests met Maestro

De app is gemaakt met **React Native** en **Expo**, maar er waren nog geen tests.
Ik koos voor **Maestro**: een tool die je app bestuurt zoals een echte gebruiker.
Hij tikt op knoppen, typt tekst en controleert wat er op het scherm staat.

Het mooie is dat je de tests schrijft in eenvoudige YAML:

```yaml
appId: host.exp.exponent
---
- openLink: exp://127.0.0.1:8081
- assertVisible: "Welkom"
- tapOn: "Inloggen"
```

### Het moeilijkste deel: alles werkend krijgen

De tests zelf schrijven ging snel. De **opzet** kostte het meeste tijd:

- **De kabel.** Mijn gsm werd niet herkend. Met `lsusb` zag ik dat mijn laptop hem
  helemaal niet zag: het was een kabel die alleen kon opladen, geen data doorsturen.
- **Xiaomi-beveiliging.** Mijn gsm blokkeerde Maestro. Ik moest extra opties aanzetten
  in de ontwikkelaarsinstellingen ("Install via USB" en "USB debugging (Security settings)").
- **Ander netwerk.** Mijn laptop en gsm zaten niet op hetzelfde netwerk. Daarom stuurde
  ik de app via de USB-kabel met een tunnel:

```bash
adb reverse tcp:8081 tcp:8081
```

Uiteindelijk had ik een paar werkende tests: de app start, het loginscherm toont de juiste
teksten, en na het inloggen verschijnt het startscherm.

### Een test moet ook kunnen falen

Een belangrijke les: een test die altijd groen is, is niets waard. Daarom veranderde ik
telkens tijdelijk een tekst naar iets wat niet bestaat. Zo controleerde ik dat de test
dan echt faalt. ❌ → ✅

## Opdracht 2: een handleiding voor releases

Het publiceren van een nieuwe versie in de stores had het team een hele namiddag gekost.
Daarom vroegen ze mij om alle stappen op te schrijven.

Ik maakte vier bestanden in Markdown:

- een **overzicht** met de gegevens van het project
- een handleiding voor **Android** (Google Play Console)
- een handleiding voor **iOS** (App Store Connect en TestFlight)
- een **voorstel** voor EAS Update

Ik schreef elke stap in eenvoudige taal: wat je doet, waar je moet klikken en wat je zou
moeten zien. Ik voegde ook een tabel **"Problemen en oplossingen"** toe, zodat de volgende
persoon dezelfde fouten niet opnieuw maakt.

### Wat ik leerde over publiceren

- **Bouwen** en **publiceren** zijn twee aparte stappen: eerst `eas build`, daarna `eas submit`.
- Bij Android komt een upload eerst op een **testtrack**. Je moet hem daarna zelf
  doorschuiven naar productie.
- Met **EAS Update** kun je kleine fixes (JavaScript, teksten, afbeeldingen) naar gebruikers
  sturen **zonder nieuwe build**, op Android én iOS. Voor native wijzigingen blijft een
  nieuwe build nodig.

## Werken met AI

Ik gebruikte Claude om dingen uit te leggen en om de code te analyseren. Wat ik daarbij
leerde: **controleer altijd wat de AI zegt.** Een paar keer klopte een conclusie niet
helemaal. Zo werd een hulpmiddel voor de ontwikkelserver aangezien voor een library die
in de app zit. Ik begrijp nu ook beter waarom je een AI duidelijke regels moet geven,
zoals "pas geen bestanden buiten deze map aan".

## Reflectie

- **Eén ding tegelijk veranderen.** Toen de app ineens werkte, had ik drie dingen tegelijk
  aangepast. Daardoor wist ik niet welke het probleem oploste. Volgende keer verander ik
  één ding per keer.
- **Werk van anderen respecteren.** Ik werkte altijd op mijn eigen Git-branch, zodat ik
  het werk van mijn collega's niet in de weg zat.
- **Goed documenteren bespaart tijd.** Wat nu een uur schrijven kost, bespaart later
  uren zoekwerk.

Volgende week wil ik meer tests schrijven en de handleiding laten nalezen door het team.
