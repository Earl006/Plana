import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/auth';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as UserPayload;
  }
  catch (error) {
    throw new Error('Invalid or expired token');
  }
};