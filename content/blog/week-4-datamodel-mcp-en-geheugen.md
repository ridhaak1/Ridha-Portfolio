---
title: "Week 4: Claude leert DeskDrive kennen (datamodel, MCP en geheugen)"
date: "2026-10-16"
summary: "Deze week kreeg de AI-container het DeskDrive-datamodel en de MCP-servers, onthoudt Claude een gesprek, en leerde ik veel over Docker build secrets, Spring Boot en Git."
tags: [docker, java, spring-boot, ai, git, reflectie]
draft: false
---

Deze week kreeg ik een opdracht van het supportteam van DeskDrive: de AI-container moest het **datamodel** van DeskDrive kennen en toegang krijgen tot hun **MCP-servers**. Het leek een kleine taak ("zet het in de Dockerfile"), maar het werd een week vol ontdekkingen.

## De opdracht: Claude moet DeskDrive leren kennen

In onze Docker-container draait een Spring Boot-server die vragen doorstuurt naar Claude. Claude wist alleen niets over DeskDrive: welke tabellen er zijn, of hoe een "order" in een bepaald domein heet. DeskDrive gaf ons twee dingen:

- een **datamodel**: een tekst die uitlegt hoe de data in elkaar zit (de handleiding)
- een lijst met **MCP-servers**: online "loketten" waar Claude informatie kan opvragen (de telefoonlijst)

## Eerst analyseren, dan bouwen

Voor ik iets aanpaste, liet ik het project eerst analyseren, en dat was een goede keuze. Ik ontdekte dat de Spring Boot-server Claude **niet** via de Claude CLI aanroept, maar rechtstreeks via de Java SDK. Bestanden in de container zetten was dus niet genoeg: niemand zou ze lezen. De **Java-code** moest ze zelf inlezen en meesturen.

Daarna heb ik de URL's eerst **met de hand getest** met `curl`, zodat ik zeker wist wat ze teruggaven voor ik er code rond schreef.

## Wat ik gebouwd heb

**In de Java-server:**

- Een nieuwe klasse leest bij het opstarten het datamodel en de MCP-lijst in.
- Het datamodel wordt achter de systeemprompt van elke vraag geplakt.
- De MCP-servers gaan mee naar de API via de **MCP connector**. Die bestaat alleen in de beta-API, dus ik moest de aanroep omzetten.
- Ontbreekt een bestand, dan geeft de server een waarschuwing en geen crash.

**In Docker:**

- Beide bestanden worden **tijdens de build** gedownload, met een **Docker build secret**. De download-URL's (met een geheime sleutel) zijn alleen tijdens die ene stap beschikbaar, en komen niet in het image.
- Elk domein krijgt een eigen image, omdat de MCP-lijst per domein verschilt.

Ik heb eerst een versie gemaakt die bij de **start** van de container downloadde. Mijn begeleider wilde het bij de **build**. Ik heb de voor- en nadelen van beide naast elkaar gezet en het daarna omgezet. Daar leerde ik dat er bijna nooit één "juiste" oplossing is, wel een afweging.

## Gespreksgeheugen

Daarna kwam er geheugen bij: met een `conversationId` kan een client nu vervolgvragen stellen.

```json
{ "prompt": "En hoeveel daarvan zijn verwijderd?", "conversationId": "..." }
```

Claude onthoudt zelf niets. Het "geheugen" is dat onze server de vorige vragen en antwoorden bij elke nieuwe vraag opnieuw meestuurt. De opslag nam ik over van een collega, en de koppeling schreef ik zelf. Daar voegde ik twee verbeteringen aan toe: een gesprek is alleen bereikbaar voor het eigen domein **en** de eigen client, en er gaan maximaal 20 berichten mee, zodat lange gesprekken niet te duur worden.

## Hoe ik getest heb

- Automatische tests: van 11 naar **35 tests**, allemaal groen.
- In de container: staan de bestanden er, met de juiste rechten? Staat er geen sleutel in `docker history`?
- In **Postman**, zoals een echte client: _"Hoeveel actieve klanten heeft dit domein?"_ gaf **73**. Ik heb dat getal daarna zelf nagerekend met een SQL-query, met dezelfde beperkte databankgebruiker.
- Geheugen: de vervolgvraag zei alleen "daarvan", en het antwoord ging toch over klanten.
- Negatieve tests: een onbekend gesprek geeft een 404, en zonder sleutel krijg je geen toegang.

Een antwoord van een AI blind geloven doe ik niet meer. Nakijken is een deel van het testen.

## Ook gedaan

- Een fout in een **Row Level Security-policy** gevonden en hersteld: een tabel was via de verkeerde oudertabel aan het domein gekoppeld.
- Het RLS-script opgeschoond, zodat het leesbaar is als documentatie.
- Een **Postman-collectie** gemaakt, zodat mijn begeleider alles zelf kan testen.

## Wat ik geleerd heb

- **Eerst begrijpen, dan bouwen.** De analyse vooraf bespaarde me een dag werk aan iets dat niet gewerkt zou hebben.
- **Geheimen veilig houden** is overal werk: niet in Git, niet in de logs, niet in het image, en ook niet in een chat.
- **Git kan je verrassen.** Een bestand dat Git negeert (zoals onze JAR), kan bij `git switch` zomaar verdwijnen. En op een gedeelde branch push je nooit met `--force`.
- **Kleine details tellen.** Op vrijdag belde een collega omdat de API "kapot" was. De oorzaak was één schuine streep op het einde van de URL: sinds Spring Boot 3 is `/api/v1/jobs/` een ander pad dan `/api/v1/jobs`. Een rollback was dus niet nodig.

## Open punten

- het image voor het tweede domein bouwen en testen
- nagaan of de sleutels van de MCP-servers verlopen
- de JAR automatisch laten bouwen in plaats van hem met de hand te kopiëren

> Een week waarin ik minder tijd aan typen besteedde dan aan begrijpen, en dat voelde juist goed.
