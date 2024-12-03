# Mystica 🔮
Mystica is a web platform built with React, powered by Node.js using an Express API for the purpose of creating cool avatars!

This is the mystica's api where all the magic happens

## Getting Started

### 1 - Clone the project

```bash
    git clone https://github.com/Drdrakin/mystica-api
```

### 2 - Access the repository and install all dependacies with npm
```bash
    cd mystica-api
```
```bash
    npm install
```

### 3 - Set up enviroment variables
    
Create your .env based on the .env-example available. You need a JWT_SECRET unique to your backend, and a ['Connection String' for mongoose](https://www.geeksforgeeks.org/mongoose-connections/). 

If you are using MongoDB Atlas, you can get this string via the web interface by choosing the Mongoose driver in a 7.0 version or later in the 'Connect New' menu.

Also, as the logic of the project is still very linked with the GCP Cloud Storage*, you need a json file with the credentials of a service account that has the permission 'Cloud Storage Administrator', these files can be generated on the google cloud. The file must be named gcp-credentials.json and sit at the root folder of this repository

### 4 - Run the project

Try using nodemon with

```bash
    npm start
```

If the project does not run, please open a Issue on the problem

*Soon the project is going to accept other forms of remote storage besides gcp cloud storage