import express from 'express';
import userController from './controllers/userController.js';

const routes = express();

routes.use('/users', userController);

export default routes;