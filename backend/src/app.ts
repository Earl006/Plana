import express from 'express';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import chatRoutes from './routes/chat.routes';  // Import chat routes
import exp from 'constants';
const cors = require('cors');

const app = express();
export const prisma = new PrismaClient();

app.use(cors({
    origin: ['http://localhost:4200', 'https://plana-o2hk.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add keep-alive endpoint
app.get('/api/keep-alive', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    message: 'Server is awake' 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/chat', chatRoutes);  // Use chat routes

// Keep-alive cron job - runs every 40 seconds
cron.schedule('*/40 * * * * *', async () => {
  try {
    // Simple database query to keep connection alive
    await prisma.user.count();
    console.log(` Keep-alive ping at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Keep-alive error:', error);
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', async ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('message', async ({ roomId, userId, message }) => {
    const msg = await prisma.message.create({
      data: {
        content: message,
        senderId: userId,
        roomId
      },
      include: {
        sender: true
      }
    });
    io.to(roomId).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export default app;
