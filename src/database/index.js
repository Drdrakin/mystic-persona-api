import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';

dotenv.config();

async function connectMySQL() {
  return await mysql.createConnection({
    host: process.env.DB_URL,
    port: 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
}

async function connectMongoDB() {

  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

export default { connectMySQL, connectMongoDB };
