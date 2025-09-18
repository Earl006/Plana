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

// Keep-alive function that makes HTTP requests
const keepServerAlive = async () => {
  try {
    // Get the server URL - Render provides this as an environment variable
    const baseUrl = process.env.RENDER_EXTERNAL_URL || 
                   `https://${process.env.RENDER_SERVICE_NAME}.onrender.com` ||
                   'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/keep-alive`, {
      method: 'GET',
      headers: {
        'User-Agent': 'KeepAlive/1.0'
      }
    });
    
    if (response.ok) {
      console.log(`🔥 Keep-alive HTTP ping successful at ${new Date().toISOString()}`);
    } else {
      console.log(`⚠️ Keep-alive ping returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Keep-alive ping failed:', error instanceof Error ? error.message : String(error));
    
    // Fallback: at least do a database operation
    try {
      await prisma.user.count();
      console.log(`📊 Fallback database ping at ${new Date().toISOString()}`);
    } catch (dbError) {
      console.error('Database fallback also failed:', dbError instanceof Error ? dbError.message : String(dbError));
    }
  }
};

// Keep-alive cron job - runs every 10 minutes (should be less than 15min Render timeout)
cron.schedule('*/10 * * * *', keepServerAlive);

// Also run immediately when server starts
setTimeout(keepServerAlive, 30000); // Wait 30 seconds after startup

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
