# Library REST API


-RUN WITHOUT DOCKER-

SETUP books project (Make sure that Node.js (version >= 12, except for v13) is installed on your operating system and npm)

Requirments: 

	- Installed Node.js version >= 12 except for v13
	- Installed npm version >= 6
	- Running mysql server

1. Need to fill initial credentials in .env file (database and admin user credentials)
2. In terminal run "npm run installApp" in root folder. This will:

	 -> install dependencies

	 -> If not exists, this will create database utf8_unicode_ci with same name as defined in .env file (DB_DATABASE variable) 

	 -> run migrations

	 -> run seeders for dummy/test data (make sure you fill admin credentials)

3. Open http://localhost:3000/api and start you're ready to go :P

4. In database/seeds/01_users.ts is list of users and their passwords


-RUN THROUGH DOCKER IMAGE-

Requirments: 

	- Linux OS
	- Installed and running Docker
	- Running mysql server

1. Need to fill initial credentials in .env file (database and admin user credentials)

2. In terminal run "docker build -t books --network=host ." to build image from Dockerfile and after that "docker run --network=host books" o run container or if you already have npm installed on your OS simply run "npm run dockerize" in root folder of project. (This could be potential problem if docker is running on windows because network host flag doen't work on Docker Desktop ). This will create image and run its container on server port:3000 with installed dependencies and migrated database.

3. Open http://localhost:3000/api and start you're ready to go :P

4. In database/seeds/01_users.ts is list of users and their passwords
