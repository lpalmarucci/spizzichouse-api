# Spizzichouse API

Benvenuto nel backend di "Spizzichouse" - un'applicazione per gestire le partite del gioco di carte Spizzico, implementato utilizzando NestJS con TypeORM e PostgreSQL.

## Descrizione

Questo backend fornisce l'infrastruttura necessaria per gestire le operazioni legate alle partite di Spizzico. Utilizza NestJS come framework per la creazione di API, TypeORM come ORM per interagire con il database PostgreSQL.

## Caratteristiche Principali
- Gestione utenti disponibili nelle partite
- Gestione Locations dove vengono giocate le partite
- Gestione delle partite e singoli round giocati
- Dashboard riassuntiva che mostra i dati delle ultime partite e un ranking globale tra tutti gli utenti

## Prerequisiti

- Node.js (versione minima 20)
- pnpm
- Docker (opzionale, per l'uso di PostgreSQL in un contenitore)

## Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/tuonome/spizzichouse-api.git
   cd spizzichouse-api
   ```

2. Installa le dipendenze
    ```bash
   pnpm i
   ```

3. Rinomina il file <code>.env.sample</code> in <code>.env</code>

4. Sostituisci i placeholder identificati da </code>`<some-value>`</code> con i valori corretti

3. Esegui il progetto con il seguente comando
    ```bash
   pnpm run start:dev
   ```

## Docker
L'applicativo è dockerizzato per semplificare l'installazione e la gestione dell'ambiente. Per utilizzare Docker:
1. Assicurati che Docker sia installato sul tuo sistema.
2. Per eseguire l'applicativo con un'istanza di PostgreSQL locale, esegui il comando <code>docker compose up -d</code>
