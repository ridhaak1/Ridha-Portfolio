---
title: "Week 3: PostgreSQL en Docker"
date: "2026-10-02"
summary: "Deze week verdiepte ik me in PostgreSQL en Docker en leerde ik hoe databases, containers, volumes en applicaties samen kunnen werken."
tags: [postgresql, docker, database, devops]
draft: false
---

---

Deze week heb ik tijdens mijn stage verder gewerkt met **PostgreSQL** en **Docker**. Ik kende databases en SQL al vanuit mijn opleiding, maar tijdens mijn stage kreeg ik meer inzicht in hoe een PostgreSQL-database in een containerized omgeving wordt gebruikt.

## PostgreSQL in Docker

Docker maakt het mogelijk om PostgreSQL in een container te draaien zonder PostgreSQL rechtstreeks op de host te installeren.

Een eenvoudige Docker Compose-configuratie kan er bijvoorbeeld zo uitzien:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Met een volume blijven de gegevens van PostgreSQL behouden wanneer de container opnieuw wordt aangemaakt.

```bash
docker compose up -d
```

Daarna kan ik controleren of de container draait:

```bash
docker ps
```

## PostgreSQL en gebruikersrechten

Een belangrijk onderdeel van PostgreSQL is dat je niet iedereen dezelfde rechten moet geven.

Je kunt bijvoorbeeld een aparte databasegebruiker maken:

```sql
CREATE ROLE app_user
WITH LOGIN
PASSWORD 'secret';
```

Daarna kunnen specifieke rechten worden toegekend:

```sql
GRANT CONNECT ON DATABASE app TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE
ON ALL TABLES IN SCHEMA public
TO app_user;
```

Op deze manier krijgt een gebruiker alleen de rechten die nodig zijn voor zijn taak.

## Row-Level Security

Een geavanceerder onderdeel van PostgreSQL is **Row-Level Security (RLS)**. Hiermee kun je niet alleen bepalen welke tabellen een gebruiker mag gebruiken, maar ook welke rijen hij mag zien.

Bijvoorbeeld:

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_by_user
ON documents
FOR SELECT
USING (user_id = current_user);
```

De database kan hierdoor zelf afdwingen welke gegevens toegankelijk zijn. Dit is interessant voor applicaties waarin meerdere gebruikers of domeinen dezelfde database gebruiken.

## Data wijzigen met transacties

PostgreSQL ondersteunt ook transacties. Hiermee kun je meerdere databasebewerkingen als één geheel uitvoeren.

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```

Als er tijdens de bewerkingen iets fout gaat, kan de transactie worden teruggedraaid:

```sql
ROLLBACK;
```

Dit voorkomt dat slechts een deel van een belangrijke databasebewerking wordt uitgevoerd.

## PostgreSQL en Docker combineren

Door PostgreSQL in Docker te draaien, kan de database onderdeel worden van dezelfde ontwikkelomgeving als de applicatie.

Bijvoorbeeld:

```yaml
services:
  app:
    build: .
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: secret
```

De applicatie kan vervolgens verbinding maken met PostgreSQL via de servicenaam `postgres` in plaats van via `localhost`.

Bijvoorbeeld:

```text
postgresql://app_user:secret@postgres:5432/app
```

Dit laat goed zien hoe Docker networking werkt: containers binnen hetzelfde Docker-netwerk kunnen elkaar bereiken via hun servicenaam.

## Wat ik deze week heb geleerd

Deze week heb ik geleerd dat PostgreSQL veel meer is dan alleen SQL-queries uitvoeren. **Rollen, toegangsrechten, transacties en Row-Level Security** kunnen rechtstreeks in de database worden gebruikt om gegevens beter te beveiligen.

Daarnaast heb ik beter begrepen hoe Docker ervoor zorgt dat PostgreSQL als een geïsoleerde service kan draaien en hoe volumes ervoor zorgen dat data behouden blijft.

Door PostgreSQL en Docker samen te gebruiken, krijg ik meer inzicht in hoe databases in een echte applicatieomgeving worden opgezet en beheerd.
