const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smartticket.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@smartticket.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
    },
  });

  const vipUser = await prisma.user.upsert({
    where: { email: 'vip@smartticket.com' },
    update: {},
    create: {
      name: 'VIP User',
      email: 'vip@smartticket.com',
      password: await bcrypt.hash('vip123', 12),
      role: 'VIP',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@smartticket.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@smartticket.com',
      password: await bcrypt.hash('user123', 12),
      role: 'REGULAR',
    },
  });

  console.log('Users created');

  // Create events
  const events = [
    {
      title: 'Summer Music Festival',
      description: 'Experience the best of summer with top artists from around the world. Three days of non-stop music, food, and fun!',
      venue: 'Central Park Arena',
      date: new Date('2024-06-15T18:00:00Z'),
      capacity: 5000,
      availableSeats: 5000,
      basePrice: 89.99,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop'
    },
    {
      title: 'Tech Innovation Summit',
      description: 'Join industry leaders for a day of insights into the latest technology trends and innovations.',
      venue: 'Convention Center',
      date: new Date('2025-05-20T09:00:00Z'),
      capacity: 1000,
      availableSeats: 750,
      basePrice: 299.99,
      category: 'Conference',
      image: 'https://images.unsplash.com/photo-1540575167068-54819b487d1c?w=800&h=400&fit=crop'
    },
    {
      title: 'Comedy Night Special',
      description: 'An evening of laughter with top comedians. Get ready for a night full of jokes and entertainment!',
      venue: 'Laugh Factory',
      date: new Date('2025-04-28T20:00:00Z'),
      capacity: 200,
      availableSeats: 50,
      basePrice: 45.00,
      category: 'Comedy',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop'
    },
    {
      title: 'Basketball Championship Finals',
      description: 'Watch the most anticipated basketball championship finals live. Experience the thrill of the game!',
      venue: 'Sports Arena',
      date: new Date('2025-05-10T19:30:00Z'),
      capacity: 15000,
      availableSeats: 12000,
      basePrice: 125.00,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop'
    },
    {
      title: 'Shakespearean Theater: Hamlet',
      description: 'A classic performance of Shakespeare\'s greatest tragedy. Experience the drama like never before.',
      venue: 'Royal Theater',
      date: new Date('2025-06-01T19:00:00Z'),
      capacity: 800,
      availableSeats: 200,
      basePrice: 75.00,
      category: 'Theater',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
    },
    {
      title: 'Web Development Workshop',
      description: 'Learn modern web development with React, Next.js, and Node.js. Hands-on workshop for all skill levels.',
      venue: 'Tech Hub',
      date: new Date('2025-05-05T10:00:00Z'),
      capacity: 50,
      availableSeats: 15,
      basePrice: 199.99,
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
    },
    {
      title: 'Food & Wine Festival',
      description: 'A culinary journey featuring local chefs, wineries, and live music. Taste the best of local cuisine!',
      venue: 'Riverside Park',
      date: new Date('2025-07-20T12:00:00Z'),
      capacity: 3000,
      availableSeats: 2800,
      basePrice: 55.00,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c?w=800&h=400&fit=crop'
    },
    {
      title: 'AI & Machine Learning Conference',
      description: 'Explore the latest in AI, ML, and deep learning with industry experts and hands-on workshops.',
      venue: 'Tech Convention Center',
      date: new Date('2025-08-15T09:00:00Z'),
      capacity: 2000,
      availableSeats: 1800,
      basePrice: 399.99,
      category: 'Conference',
      image: 'https://images.unsplash.com/photo-1677442136019-217803ad98a7?w=800&h=400&fit=crop'
    },
    {
      title: 'Stand-up Comedy Night',
      description: 'An evening of hilarious stand-up comedy featuring local and national comedians.',
      venue: 'Comedy Club Downtown',
      date: new Date('2025-07-10T20:00:00Z'),
      capacity: 150,
      availableSeats: 120,
      basePrice: 35.00,
      category: 'Comedy',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop'
    },
    {
      title: 'Soccer Championship Match',
      description: 'Watch the championship finals between top teams. Experience the excitement of live soccer!',
      venue: 'National Stadium',
      date: new Date('2025-06-25T19:00:00Z'),
      capacity: 50000,
      availableSeats: 45000,
      basePrice: 85.00,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1517468198891-8e745b4f3c2e?w=800&h=400&fit=crop'
    },
    {
      title: 'Broadway Musical: Hamilton',
      description: 'Experience the award-winning musical that tells the story of American founding father Alexander Hamilton.',
      venue: 'Grand Theater',
      date: new Date('2025-09-01T19:30:00Z'),
      capacity: 2000,
      availableSeats: 500,
      basePrice: 150.00,
      category: 'Theater',
      image: 'https://images.unsplash.com/photo-1503075887709-e046c246897a?w=800&h=400&fit=crop'
    },
    {
      title: 'Jazz & Blues Festival',
      description: 'Three days of smooth jazz and blues featuring renowned artists from around the world.',
      venue: 'Harmony Hall',
      date: new Date('2025-08-05T18:00:00Z'),
      capacity: 2500,
      availableSeats: 2000,
      basePrice: 95.00,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1493225457124-a9eb6d7b8e2c?w=800&h=400&fit=crop'
    }
  ];

  // Clear existing events and create fresh ones
  await prisma.ticket.deleteMany({});
  await prisma.waitlist.deleteMany({});
  await prisma.event.deleteMany({});
  
  for (const eventData of events) {
    await prisma.event.create({
      data: eventData,
    });
  }

  console.log('Events created');

  // Create some sample tickets
  const musicEvent = await prisma.event.findFirst({
    where: { title: 'Summer Music Festival' }
  });

  if (musicEvent) {
    // Create a booked ticket for regular user
    await prisma.ticket.create({
      data: {
        userId: regularUser.id,
        eventId: musicEvent.id,
        seatType: 'NORMAL',
        quantity: 2,
        status: 'BOOKED',
        price: 179.98,
        qrCode: 'TICKET-SAMPLE-QR-CODE-1'
      }
    });

    // Update available seats
    await prisma.event.update({
      where: { id: musicEvent.id },
      data: { availableSeats: musicEvent.availableSeats - 2 }
    });

    // Create a waitlisted ticket for VIP user (to test priority)
    const comedyEvent = await prisma.event.findFirst({
      where: { title: 'Comedy Night Special' }
    });

    if (comedyEvent) {
      await prisma.ticket.create({
        data: {
          userId: vipUser.id,
          eventId: comedyEvent.id,
          seatType: 'VIP',
          quantity: 1,
          status: 'WAITLISTED',
          price: 112.50
        }
      });

      // Add to waitlist (handle duplicates)
      try {
        await prisma.waitlist.create({
          data: {
            eventId: comedyEvent.id,
            userId: vipUser.id,
            position: 1
          }
        });
      } catch (error) {
        if (error.code !== 'P2002') {
          throw error; // Re-throw if not a duplicate error
        }
        console.log('Waitlist entry already exists, skipping...');
      }
    }
  }

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: regularUser.id,
        message: 'Your booking for Summer Music Festival has been confirmed!',
        type: 'BOOKING_CONFIRMED',
        status: 'UNREAD'
      },
      {
        userId: vipUser.id,
        message: 'You have been added to the waitlist for Comedy Night Special',
        type: 'WAITLIST_PROMOTION',
        status: 'UNREAD'
      },
      {
        userId: adminUser.id,
        message: 'Welcome to Smart Ticketing System! You can now manage events.',
        type: 'BOOKING_CONFIRMED',
        status: 'READ'
      }
    ]
  });

  console.log('Sample data created');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
