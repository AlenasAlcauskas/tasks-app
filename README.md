## Run with docker (recommended)
Install docker and docker-compose if not present on your system

Navigate to project directory

Run:

```bash
sudo ./build.sh
sudo docker-compose up
sensible-browser http://localhost:8000
```


Alternatively, run each command inside the build.sh file in its respective order

## Run without docker

Make sure php7.4, symfony cli, composer, mysql-server and npm are installed on your system.

In .env replace database host 'mysql' to 127.0.0.1:3306

Run:

```bash
composer install
npm install
npm run build
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
symfony server:start
```

Then open the project in http://localhost:8000
