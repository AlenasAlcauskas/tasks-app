docker-compose build &&
docker-compose run --rm composer install &&
docker-compose run --rm npm npm install &&
docker-compose run --rm npm npm run build &&
docker-compose run --rm php php bin/console doctrine:schema:update --force