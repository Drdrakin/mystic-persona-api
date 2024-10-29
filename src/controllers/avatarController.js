import express from 'express';
import service from '../services/avatarService.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
  try {
    const parts = await service.getAvatarParts();
    res.json(parts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routes.post('/', async (req, res) => {
  try {
    const newPart = await service.createAvatarPart(req.body);
    res.status(201).json(newPart);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routes.put('/:id', async (req, res) => {
  try {
    const updatedPart = await service.updateAvatarPart(req.params.id, req.body);
    res.json(updatedPart);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    await service.deleteAvatarPart(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

export default routes;
