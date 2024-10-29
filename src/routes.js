import express from 'express';
import userController from './controllers/userController.js';
import avatarController from './controllers/avatarController.js';

const routes = express();
routes.use('/users', userController);
routes.use('/avatar', avatarController);

export default routes;