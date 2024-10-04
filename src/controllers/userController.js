import express from 'express';
import service from '../services/userService.js';

const routes = express.Router();

routes.post('/register', async (req, res) => {
    const { firstName, lastName, birthday, email, password } = req.body;

    try {

        await service.createUser(firstName, lastName, birthday, email, password);
        
        return res.status(201).send({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
});

routes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { token, user } = await service.login(email, password);
        res.status(200).send({ message: 'Login bem-sucedido!', token, user });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
});

export default routes;