# Donut shop app

## Requisiti

- [PHP](https://php.net) 8.1+
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) 19+
- [Corepack](https://nodejs.org/api/corepack.html) attivato
- [MySQL](https://mysql.com) 8.0+

## Installazione

1. Clonare il repository
2. Installare le dipendenze PHP con `composer update`
3. Installare le dipendenze JavaScript con `pnpm install` (pnpm viene automaticamente installato con Corepack, una volta attivato)
4. Copiare il file `.env.example` in `.env` (se non già presente) e configurare le variabili d'ambiente (database)
5. Eseguire il comando `php artisan key:generate` se non è già presente la chiave di applicazione nel file `.env` (`APP_KEY`)
6. Eseguire il comando `php artisan migrate` per eseguire le migrazioni del database
7. Avviare il server con `php artisan serve` e il server di frontend con `pnpm run dev`

## Produzione

Nel caso in cui si voglia utilizzare l'applicazione in produzione, è consigliato non utilizzare i server di sviluppo in locale, ma bensì un proprio server web (Apache, Nginx, etc.) e un database MySQL.
Il webserver deve puntare alla cartella `public` del progetto, mentre il database deve essere configurato nel file `.env` (seguendo il formato di `.env.example`).
Inoltre, è necessario compilare le risorse JavaScript e CSS con il comando `pnpm run build`.
