import express from 'express';
import service from '../services/avatarService.js';
import upload from '../middleware/fileUpload.js';
import GCP from '../utils/googleCloudStorage.js';

const routes = express.Router();

routes.post('/user-avatar', async (req, res) => {
  try {
    if (!req.body.userId) { 
      return res.status(400).send('User ID is required');
    }

    const savedAvatar = await service.createUserAvatar(req.body);
    res.status(201).send(savedAvatar);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

routes.get('/categories', async (req, res) => {
  try {
      const categories = await service.getCategories();
      res.json(categories);
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});

routes.get('/user-avatar', async (req, res) => {

  const { userId } = req.query;

  try {
      const avatars = await service.getUserAvatars(userId);
      res.json(avatars);
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});

routes.get('/components', async (req, res) => {
  const { category } = req.query;
  try {
      const components = await service.getComponentsByCategory(category);
      res.json(components);
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});

routes.get('/', async (req, res) => {
  try {
    const parts = await service.getAvatarParts();
    res.json(parts);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

routes.post('/', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await GCP.uploadImage(req.file);
    const newPart = await service.createAvatarPart({
      ...req.body,
      imageUrl
    });
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
