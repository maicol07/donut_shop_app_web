#!/bin/bash
cd /var/www/vhosts/localhost/html || exit
dotenv set DB_HOST="${MYSQL_HOST}" DB_USERNAME="${MYSQL_USER}" DB_PASSWORD="${MYSQL_PASSWORD}" DB_DATABASE="${MYSQL_DATABASE}" DB_PORT="${MYSQL_PORT}"

php artisan cache:clear
php artisan config:cache
php artisan migrate
/ols-entrypoint.sh
