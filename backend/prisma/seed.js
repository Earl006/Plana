require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.ticketBooking.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.message.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  // Seed Admin Users
  console.log('👤 Seeding admin users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const attendeePassword = await bcrypt.hash('attendee123', 10);

  const adminUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@plana.com',
      phoneNumber: '+254700000001',
      passwordHash: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN',
      managerRequestStatus: 'APPROVED',
    },
  });

  const eventManager1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'manager1@plana.com',
      phoneNumber: '+254700000002',
      passwordHash: managerPassword,
      firstName: 'John',
      lastName: 'Manager',
      role: 'EVENT_MANAGER',
      managerRequestStatus: 'APPROVED',
    },
  });

  const eventManager2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'manager2@plana.com',
      phoneNumber: '+254700000003',
      passwordHash: managerPassword,
      firstName: 'Sarah',
      lastName: 'Events',
      role: 'EVENT_MANAGER',
      managerRequestStatus: 'APPROVED',
    },
  });

  const attendee1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'user1@plana.com',
      phoneNumber: '+254700000004',
      passwordHash: attendeePassword,
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'ATTENDEE',
      managerRequestStatus: 'NOT-REQUESTED',
    },
  });

  const attendee2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'user2@plana.com',
      phoneNumber: '+254700000005',
      passwordHash: attendeePassword,
      firstName: 'Bob',
      lastName: 'Smith',
      role: 'ATTENDEE',
      managerRequestStatus: 'NOT-REQUESTED',
    },
  });

  console.log('✅ Admin users created successfully');

  // Seed Categories
  console.log('📂 Seeding categories...');
  const musicCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Music & Concerts',
    },
  });

  const techCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Technology & Innovation',
    },
  });

  const sportsCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Sports & Fitness',
    },
  });

  const businessCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Business & Networking',
    },
  });

  const artCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Arts & Culture',
    },
  });

  const foodCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Food & Drinks',
    },
  });

  console.log('✅ Categories created successfully');

  // Seed Events with Tickets
  console.log('🎉 Seeding events...');

  // Music Event 1
  const musicFestival = await prisma.event.create({
    data: {
      id: uuidv4(),
      title: 'Nairobi Music Festival 2025',
      description: 'The biggest music festival in East Africa featuring top local and international artists. Experience three days of non-stop entertainment with multiple stages and food vendors.',
      date: new Date('2025-12-15T18:00:00Z'),
      location: 'Uhuru Gardens, Nairobi',
      managerId: eventManager1.id,
      categoryId: musicCategory.id,
      posterUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      tickets: {
        create: [
          {
            id: uuidv4(),
            type: 'Early Bird',
            price: 2500,
            quantity: 500,
          },
          {
            id: uuidv4(),
            type: 'Regular',
            price: 3500,
            quantity: 1000,
          },
          {
            id: uuidv4(),
            type: 'VIP',
            price: 8000,
            quantity: 200,
          },
          {
            id: uuidv4(),
            type: 'VVIP',
            price: 15000,
            quantity: 50,
          },
        ],
      },
    },
  });

  // Tech Event
  const techConference = await prisma.event.create({
    data: {
      id: uuidv4(),
      title: 'Kenya Tech Summit 2025',
      description: 'Leading technology conference bringing together innovators, entrepreneurs, and tech enthusiasts. Featuring keynote speakers, workshops, and networking opportunities.',
      date: new Date('2025-11-20T08:00:00Z'),
      location: 'KICC, Nairobi',
      managerId: eventManager2.id,
      categoryId: techCategory.id,
      posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      tickets: {
        create: [
          {
            id: uuidv4(),
            type: 'Student',
            price: 1500,
            quantity: 300,
          },
          {
            id: uuidv4(),
            type: 'Professional',
            price: 5000,
            quantity: 500,
          },
          {
            id: uuidv4(),
            type: 'Premium',
            price: 10000,
            quantity: 100,
          },
        ],
      },
    },
  });

  // Sports Event
  const marathonEvent = await prisma.event.create({
    data: {
      id: uuidv4(),
      title: 'Nairobi International Marathon',
      description: 'Annual marathon event attracting runners from across the globe. Multiple race categories including 42km, 21km, 10km, and 5km fun run.',
      date: new Date('2025-10-26T06:00:00Z'),
      location: 'Starting at Nyayo Stadium, Nairobi',
      managerId: eventManager1.id,
      categoryId: sportsCategory.id,
      posterUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
      tickets: {
        create: [
          {
            id: uuidv4(),
            type: 'Full Marathon (42km)',
            price: 3000,
            quantity: 1000,
          },
          {
            id: uuidv4(),
            type: 'Half Marathon (21km)',
            price: 2000,
            quantity: 1500,
          },
          {
            id: uuidv4(),
            type: 'Fun Run (5km)',
            price: 1000,
            quantity: 2000,
          },
        ],
      },
    },
  });

  // Business Event
  const businessSummit = await prisma.event.create({
    data: {
      id: uuidv4(),
      title: 'East Africa Business Summit',
      description: 'Premier business networking event connecting entrepreneurs, investors, and business leaders across East Africa.',
      date: new Date('2025-11-10T09:00:00Z'),
      location: 'Serena Hotel, Nairobi',
      managerId: eventManager2.id,
      categoryId: businessCategory.id,
      posterUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      tickets: {
        create: [
          {
            id: uuidv4(),
            type: 'Standard',
            price: 7500,
            quantity: 300,
          },
          {
            id: uuidv4(),
            type: 'Executive',
            price: 15000,
            quantity: 100,
          },
          {
            id: uuidv4(),
            type: 'Platinum',
            price: 25000,
            quantity: 50,
          },
        ],
      },
    },
  });

  // Art Event
  const artExhibition = await prisma.event.create({
    data: {
      id: uuidv4(),
      title: 'Contemporary African Art Exhibition',
      description: 'Showcasing the finest contemporary African art with works from renowned artists across the continent.',
      date: new Date('2025-12-05T10:00:00Z'),
      location: 'National Museums of Kenya',
      managerId: eventManager1.id,
      categoryId: artCategory.id,
      posterUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800',
      tickets: {
        create: [
          {
            id: uuidv4(),
            type: 'General Admission',
            price: 800,
            quantity: 500,
          },
          {
            id: uuidv4(),
            type: 'Guided Tour',
            price: 1500,
            quantity: 100,
          },
          {
            id: uuidv4(),
            type: 'Opening Night',
            price: 3000,
            quantity: 150,
          },
        ],
      },
    },
  });

  // Food Event
  const foodFestival = await prisma.event.create({
    data: {
      id: uuidv4(),
      title: 'Nairobi Street Food Festival',
      description: 'Celebrate the diverse culinary culture of Kenya with street food vendors, cooking demonstrations, and live entertainment.',
      date: new Date('2025-12-20T12:00:00Z'),
      location: 'Central Park, Nairobi',
      managerId: eventManager2.id,
      categoryId: foodCategory.id,
      posterUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      tickets: {
        create: [
          {
            id: uuidv4(),
            type: 'Entry Pass',
            price: 500,
            quantity: 1000,
          },
          {
            id: uuidv4(),
            type: 'Food Voucher Bundle',
            price: 2000,
            quantity: 500,
          },
          {
            id: uuidv4(),
            type: 'VIP Experience',
            price: 5000,
            quantity: 100,
          },
        ],
      },
    },
  });

  console.log('✅ Events created successfully');

  // Create some sample bookings
  console.log('📝 Creating sample bookings...');

  // Get tickets for booking
  const musicFestivalTickets = await prisma.ticket.findMany({
    where: { eventId: musicFestival.id },
  });

  const techConferenceTickets = await prisma.ticket.findMany({
    where: { eventId: techConference.id },
  });

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      id: uuidv4(),
      userId: attendee1.id,
      eventId: musicFestival.id,
      quantity: 2,
      totalPrice: 7000, // 2 x Regular tickets
      verificationCode: 'MF2025001',
      TicketBookings: {
        create: [
          {
            id: uuidv4(),
            ticketId: musicFestivalTickets[1].id, // Regular ticket
            quantity: 2,
          },
        ],
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      id: uuidv4(),
      userId: attendee2.id,
      eventId: techConference.id,
      quantity: 1,
      totalPrice: 5000, // Professional ticket
      verificationCode: 'TC2025001',
      TicketBookings: {
        create: [
          {
            id: uuidv4(),
            ticketId: techConferenceTickets[1].id, // Professional ticket
            quantity: 1,
          },
        ],
      },
    },
  });

  // Update ticket quantities
  await prisma.ticket.update({
    where: { id: musicFestivalTickets[1].id },
    data: { quantity: { decrement: 2 } },
  });

  await prisma.ticket.update({
    where: { id: techConferenceTickets[1].id },
    data: { quantity: { decrement: 1 } },
  });

  console.log('✅ Sample bookings created successfully');

  // Create chat rooms for events
  console.log('💬 Creating chat rooms...');
  
  await prisma.room.create({
    data: {
      id: uuidv4(),
      name: 'Nairobi Music Festival 2025',
    },
  });

  await prisma.room.create({
    data: {
      id: uuidv4(),
      name: 'Kenya Tech Summit 2025',
    },
  });

  console.log('✅ Chat rooms created successfully');

  console.log('🎉 Database seeding completed successfully!');
  
  // Print summary
  console.log('\n📊 Seeding Summary:');
  console.log(`👥 Users: ${await prisma.user.count()}`);
  console.log(`📂 Categories: ${await prisma.category.count()}`);
  console.log(`🎉 Events: ${await prisma.event.count()}`);
  console.log(`🎫 Tickets: ${await prisma.ticket.count()}`);
  console.log(`📝 Bookings: ${await prisma.booking.count()}`);
  console.log(`💬 Rooms: ${await prisma.room.count()}`);

  console.log('\n🔐 Test Credentials:');
  console.log('Admin: admin@plana.com / admin123');
  console.log('Manager 1: manager1@plana.com / manager123');
  console.log('Manager 2: manager2@plana.com / manager123');
  console.log('Attendee 1: user1@plana.com / attendee123');
  console.log('Attendee 2: user2@plana.com / attendee123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });