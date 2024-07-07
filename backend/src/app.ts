import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';

const app = express();
export const prisma = new PrismaClient();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/booking', bookingRoutes);

export default app;
