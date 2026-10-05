---
title: "Week 1 & 2: Deskdrive leren kennen"
date: "2026-10-05"
summary: "Mijn eerste twee weken op stage bij Deskdrive: het bedrijf leren kennen, klantgegevens afschermen met RLS en werken met MCP-servers en Java-microservices."
tags: [stage, deskdrive, sql, java]
cover: /images/blog/week-1/cover.png
coverAlt: "Mijn werkplek bij Deskdrive tijdens de eerste stageweken"
draft: false
---

Twee weken geleden begon mijn stage bij **Deskdrive**. De eerste dagen stonden vooral in het teken van kennismaken: met de mensen, met het bedrijf en met de software die ze maken.

## Kennismaken met Deskdrive

Deskdrive maakt software voor bedrijven. Een groot deel draait rond **CRM** en **ERP**.

- **CRM** gaat over klanten: wie zijn je klanten, wat heb je met hen afgesproken, wat loopt er nog.
- **ERP** gaat over het bedrijf zelf: bestellingen, voorraad, facturen en planning.

De software is gebouwd met onder andere **Java**, een **PostgreSQL**-databank en verschillende kleine diensten (microservices) die met elkaar samenwerken. In het begin was dat veel nieuwe informatie, maar door er zelf mee te werken begon ik het stap voor stap te begrijpen.

## Klantgegevens afschermen met RLS

Mijn eerste echte taak ging over de databank. Ik heb SQL geschreven en een **policy** toegevoegd met **Row Level Security (RLS)**.

RLS zorgt ervoor dat een gebruiker alleen de rijen ziet die bij zijn eigen klantdomein horen. Je kan het vergelijken met een appartementsgebouw: iedereen gebruikt hetzelfde gebouw, maar met jouw sleutel kom je alleen in je eigen appartement.

Een vereenvoudigd voorbeeld:

```sql
-- RLS aanzetten op de tabel
ALTER TABLE klanten ENABLE ROW LEVEL SECURITY;

-- Alleen rijen van je eigen domein lezen (USING) en schrijven (WITH CHECK)
CREATE POLICY eigen_domein ON klanten
  USING (domain_id = current_setting('app.domain_id')::int)
  WITH CHECK (domain_id = current_setting('app.domain_id')::int);
```

Daarbij heb ik ook geleerd:

- het verschil tussen **USING** (welke rijen mag je zien) en **WITH CHECK** (welke rijen mag je toevoegen of aanpassen);
- hoe databasegebruikers aan een klantdomein gekoppeld worden;
- wat **SECURITY DEFINER** doet, en het verschil tussen `session_user` en `current_user`.

## Werken met MCP-servers en Java-microservices

Daarnaast heb ik gewerkt met **MCP-servers**. Een MCP-server geeft een AI-assistent toegang tot tools en gegevens, zoals een stopcontact waar de AI kan op inpluggen. Bij Deskdrive praten die MCP-servers met de **Java-microservices** van het bedrijf. Zo leerde ik hoe de verschillende onderdelen met elkaar verbonden zijn.

## Verder met de AI-container

Ik heb ook gewerkt aan de **Docker**-configuratie en de Compose-bestanden gecontroleerd. In de Dockerfile worden onder andere Java en de PostgreSQL-client geïnstalleerd. Ik heb gezien hoe instellingen zoals `DOMAIN_ID` en de databankconfiguratie via **environment variables** in de container terechtkomen, en waarom geheimen (zoals wachtwoorden) apart bewaard worden en niet in de code.

## Een formulier in React Native

Als laatste heb ik een klein **Expo**-project gemaakt met **TypeScript**. Daarin laad ik een HTML-formulier in een **WebView**. Het formulier heeft een nummer, een tekstveld en een kleurkeuze. Met `postMessage` stuur ik de gegevens naar React Native, waar ik ze ontvang. In de console kon ik controleren dat de ingevulde gegevens goed aankwamen.

## Wat ik meeneem

Mijn eerste twee weken waren druk, maar heel leerrijk. Ik heb gezien hoe een echt bedrijf zijn software opbouwt, en ik heb al meteen aan echte onderdelen kunnen werken. Volgende week ga ik hier verder op bouwen.

<!--
Foto in de tekst toevoegen? Zet het bestand in public/images/blog/week-1/ en gebruik:
![Beschrijving van de foto](/images/blog/week-1/foto.jpg)
-->
