import { METHODS } from 'http';
import app from './app';
import dotenv from 'dotenv';
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} . . .`);
});