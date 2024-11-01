import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import connect from './database/index.js';

const app = express();

app.use(cors());
app.use(express.json());

connect.connectMongoDB().then(() => {
  app.use('/', routes);

  const PORT = 3333;

  app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
