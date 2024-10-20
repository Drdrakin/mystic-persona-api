# Mystica 🔮
Mystica is a web platform built with React, powered by a Node.js Express API for the purpose of creating dynamic avatars !

This is mystica's api where all the magic happens

## How to run the project ?

### With docker

You need to create a ```.env``` file following the given example in the root directory of this repository, and run the command:

```bash
npm run docker
```

The necessary database and tables will be created with the initalizing script!

### Manually

You still need to create a ```.env``` file following the given example in the root directory of this repository, since it its necessary to run the project, and then host your database in the service of your choice, using the script in ```createDatabase.sql```and making sure the DB_NAME variable corresponds with the database name in the script.