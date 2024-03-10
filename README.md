# Spizzichouse API

Benvenuto nel backend di "Spizzichouse" - un'applicazione per gestire le partite del gioco di carte Spizzico, implementato utilizzando NestJS con TypeORM e PostgreSQL.

## Descrizione

Questo backend fornisce l'infrastruttura necessaria per gestire le operazioni legate alle partite di Spizzico. Utilizza NestJS come framework per la creazione di API, TypeORM come ORM per interagire con il database PostgreSQL.

## Caratteristiche Principali

- Gestione delle partite di Spizzico
- Persistenza dati con TypeORM e PostgreSQL
- API RESTful per interagire con l'applicazione frontend

## Prerequisiti

- Node.js (versione minima 20)
- pnpm
- Docker (opzionale, per l'uso di PostgreSQL in un contenitore)

## Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/tuonome/spizzichouse-backend.git
   cd spizzichouse-backend
   ```

2. Installa le dipendenze
    ```bash
   pnpm i
   ```
   
3. Copia il contenuto del file <code>.env.sample</code> e copialo in un file chiamato <code>.env</code>

4. Modifica le variabili inserendo i valori desiderati

3. Esegui il progetto
    ```bash
   pnpm run start:dev
   ```

## Docker
L'applicativo è dockerizzato per semplificare l'installazione e la gestione dell'ambiente. Per utilizzare Docker:
1. Assicurati che Docker sia installato sul tuo sistema.
2. Per eseguire l'applicativo con un'istanza di PostgreSQL locale, esegui il comando <code>docker compose up -d</code>
