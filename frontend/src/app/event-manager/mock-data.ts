// src/app/mock-data.ts

export const mockEvent = {
    id: 'd629e443-7c53-48a4-93b3-b44d487da789',
    title: 'Summer Music Festival',
    description: 'A weekend of great music and fun',
    date: '2023-07-15T18:00:00Z',
    location: 'Chuka',
    categoryId: 'f17ff256-d6b3-4bc1-b095-fd18a3d424d0',
    tickets: [
      { type: 'General Admission', price: 5000, quantity: 1000 },
      { type: 'VIP', price: 10000, quantity: 100 }
    ]
  };
  
  export const mockCategories = [
    { id: 'f17ff256-d6b3-4bc1-b095-fd18a3d424d0', name: 'Music' },
    { id: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', name: 'Sports' },
    { id: 'g6h7i8j9-k0l1-4m5n-6o7p-8q9r0s1t2u3', name: 'Art' }
  ];