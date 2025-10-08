Node.js Backend Project Template

This project is a base template for building backend applications using Node.js, Express, and MySQL.
It has been designed by keeping common coding practices and clean architecture in mind.
The structure makes it easy to maintain, extend, and understand.
You can freely change or add things as per your project needs.

Inside the src Folder

All the source code for the project is kept inside the src folder.
Tests are not included here — you can create a separate tests folder if required.
Here’s a breakdown of each part:

config

This folder contains all the setup and configuration files for the application.
For example:

Setting up dotenv so environment variables can be used easily.

Database configuration files.

If you are using a logger library, its setup will also go here.

routes

This folder defines all the application routes.
Each route is connected to its middleware(s) and the respective controller.

middlewares

Middlewares act as request interceptors.
You can add validators, authenticators, or logging functionality here.
They run before the request reaches the controller.

controllers

Controllers are the entry point to the business logic.
They receive the incoming request and pass the data to the services layer.
Once the service returns a result, the controller structures the response and sends it back to the client.

services

This layer contains the actual business logic of the application.
It talks to the repositories to fetch or update data in the database, processes it if needed, and returns it to the controllers.

repositories

Repositories contain all database-related code.
Whether you are writing raw SQL queries or using an ORM like Sequelize, that logic stays here.
This keeps database interaction separate from the rest of the app.

utils

This folder contains helper functions, reusable code, and custom error classes.
Anything that can be reused across the project should go here.

Setup Instructions

Download or clone this project and open it in your editor.

Install the dependencies:

npm install


Create a .env file in the root folder and add the following variables:

PORT=3000
DB_USER=root
DB_PASS=yourpassword
DB_NAME=mydb
DB_HOST=localhost
DIALECT=mysql


Run the following command to initialize Sequelize:

npx sequelize init


This will generate migrations/, seeders/, and a config.json file inside the config folder.

For development, update the username, password, and dialect according to your local database.

For test or production, update the host with your hosted database details.

Start the server:

npm run dev
