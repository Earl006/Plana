// src/types/auth.ts

export interface UserPayload {
    userId: string;  // Changed from 'id' to 'userId' to be more explicit
    email: string;
    role: string;
    phoneNumber: string; // Added phoneNumber
    firstName: string;
    lastName: string;
      
  }