# Mystica 🔮
Mystica is a web platform built with React, powered by Node.js using an Express API for the purpose of creating cool avatars!

This is the mystica's api where all the magic happens

## How to run the project ?

### With docker

You need to create a ```.env``` file following the given example in the root directory of this repository, and run the command:

```bash
npm run docker
```

The necessary database and tables will be created with the initalizing script!

### Without docker

You still need to create a ```.env``` file following the given example in the root directory of this repository, since it its necessary to run the project. Then you need to host and create your database in a service of your choice using the script in ```repository/createDatabase.sql``` and making sure the DB_NAME variable in your env file corresponds with the database name in the script.

### Start the API

Once the settings are all in place, you can use the following script to run the project with Nodemon:

```bash
npm start
```