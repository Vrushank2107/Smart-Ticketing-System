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

  // Create events with future dates for testing
  const currentDate = new Date();
  const events = [
    {
      title: 'Summer Music Festival 2025',
      description: 'Experience the best of summer with top artists from around the world. Three days of non-stop music, food, and fun!',
      venue: 'Central Park Arena',
      date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      capacity: 5000,
      availableSeats: 5000,
      basePrice: 7499.00,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop'
    },
    {
      title: 'Tech Innovation Summit 2025',
      description: 'Join industry leaders for a day of insights into the latest technology trends and innovations.',
      venue: 'Convention Center',
      date: new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      capacity: 1000,
      availableSeats: 750,
      basePrice: 24999.00,
      category: 'Conference',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop'
    },
    {
      title: 'Comedy Night Special',
      description: 'An evening of laughter with top comedians. Get ready for a night full of jokes and entertainment!',
      venue: 'Laugh Factory',
      date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      capacity: 200,
      availableSeats: 50,
      basePrice: 3749.00,
      category: 'Comedy',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop'
    },
    {
      title: 'Basketball Championship Finals',
      description: 'Watch the most anticipated basketball championship finals live. Experience the thrill of the game!',
      venue: 'Sports Arena',
      date: new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      capacity: 15000,
      availableSeats: 12000,
      basePrice: 10499.00,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop'
    },
    {
      title: 'Shakespearean Theater: Hamlet',
      description: 'A classic performance of Shakespeare\'s greatest tragedy. Experience the drama like never before.',
      venue: 'Royal Theater',
      date: new Date(currentDate.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      capacity: 800,
      availableSeats: 200,
      basePrice: 6249.00,
      category: 'Theater',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
    },
    {
      title: 'Web Development Workshop',
      description: 'Learn modern web development with React, Next.js, and Node.js. Hands-on workshop for all skill levels.',
      venue: 'Tech Hub',
      date: new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      capacity: 50,
      availableSeats: 15,
      basePrice: 16699.00,
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
    },
    {
      title: 'Food & Wine Festival',
      description: 'A culinary journey featuring local chefs, wineries, and live music. Taste the best of local cuisine!',
      venue: 'Riverside Park',
      date: new Date(currentDate.getTime() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
      capacity: 3000,
      availableSeats: 2800,
      basePrice: 4599.00,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=400&fit=crop'
    },
    {
      title: 'AI & Machine Learning Conference',
      description: 'Explore the latest in AI, ML, and deep learning with industry experts and hands-on workshops.',
      venue: 'Tech Convention Center',
      date: new Date(currentDate.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
      capacity: 2000,
      availableSeats: 1800,
      basePrice: 33399.00,
      category: 'Conference',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop'
    },
    {
      title: 'Stand-up Comedy Night',
      description: 'An evening of hilarious stand-up comedy featuring local and national comedians.',
      venue: 'Comedy Club Downtown',
      date: new Date(currentDate.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      capacity: 150,
      availableSeats: 120,
      basePrice: 2929.00,
      category: 'Comedy',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop'
    },
    {
      title: 'Soccer Championship Match',
      description: 'Watch the championship finals between top teams. Experience the excitement of live soccer!',
      venue: 'National Stadium',
      date: new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
      capacity: 50000,
      availableSeats: 45000,
      basePrice: 7099.00,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop'
    },
    {
      title: 'Broadway Musical: Hamilton',
      description: 'Experience the award-winning musical that tells the story of American founding father Alexander Hamilton.',
      venue: 'Grand Theater',
      date: new Date(currentDate.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      capacity: 2000,
      availableSeats: 500,
      basePrice: 12499.00,
      category: 'Theater',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=400&fit=crop'
    },
    {
      title: 'Jazz & Blues Festival',
      description: 'Three days of smooth jazz and blues featuring renowned artists from around the world.',
      venue: 'Harmony Hall',
      date: new Date(currentDate.getTime() + 38 * 24 * 60 * 60 * 1000), // 38 days from now
      capacity: 2500,
      availableSeats: 2000,
      basePrice: 95.00,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop'
    },
    {
      title: 'Rock Concert Night',
      description: 'An explosive night of rock music featuring top bands and electric performances.',
      venue: 'Stadium Arena',
      date: new Date(currentDate.getTime() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      capacity: 8000,
      availableSeats: 7500,
      basePrice: 9999.00,
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop'
    },
    {
      title: 'Yoga & Wellness Retreat',
      description: 'A relaxing day of yoga, meditation, and wellness workshops with certified instructors.',
      venue: 'Wellness Center',
      date: new Date(currentDate.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      capacity: 100,
      availableSeats: 80,
      basePrice: 5429.00,
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=400&fit=crop'
    },
    {
      title: 'Corporate Leadership Summit',
      description: 'Learn from industry leaders about management strategies and corporate innovation.',
      venue: 'Business Center',
      date: new Date(currentDate.getTime() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
      capacity: 500,
      availableSeats: 450,
      basePrice: 20999.00,
      category: 'Conference',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop'
    },
    {
      title: 'Indie Film Festival',
      description: 'Celebrate independent cinema with screenings of groundbreaking films from emerging directors.',
      venue: 'Arts Theater',
      date: new Date(currentDate.getTime() + 26 * 24 * 60 * 60 * 1000), // 26 days from now
      capacity: 300,
      availableSeats: 280,
      basePrice: 3349.00,
      category: 'Theater',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=400&fit=crop'
    },
    {
      title: 'Tennis Championship Finals',
      description: 'Watch the world\'s best tennis players compete in an exciting championship match.',
      venue: 'Tennis Complex',
      date: new Date(currentDate.getTime() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
      capacity: 5000,
      availableSeats: 4800,
      basePrice: 7949.00,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&h=400&fit=crop'
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
    where: { title: 'Summer Music Festival 2025' }
  });

  if (musicEvent) {
    // Create multiple booked tickets for regular user
    await prisma.ticket.createMany({
      data: [
        {
          userId: regularUser.id,
          eventId: musicEvent.id,
          seatType: 'NORMAL',
          quantity: 2,
          status: 'BOOKED',
          price: 14998.00,
          qrCode: 'TICKET-SAMPLE-QR-CODE-1'
        },
        {
          userId: regularUser.id,
          eventId: musicEvent.id,
          seatType: 'VIP',
          quantity: 1,
          status: 'BOOKED',
          price: 14998.00,
          qrCode: 'TICKET-SAMPLE-QR-CODE-2'
        }
      ]
    });

    // Update available seats
    await prisma.event.update({
      where: { id: musicEvent.id },
      data: { availableSeats: musicEvent.availableSeats - 3 }
    });
  }

  // Create more tickets for other events
  const techEvent = await prisma.event.findFirst({
    where: { title: 'Tech Innovation Summit 2025' }
  });

  if (techEvent) {
    await prisma.ticket.createMany({
      data: [
        {
          userId: adminUser.id,
          eventId: techEvent.id,
          seatType: 'PREMIUM',
          quantity: 1,
          status: 'BOOKED',
          price: 24999.00,
          qrCode: 'TICKET-SAMPLE-QR-CODE-3'
        },
        {
          userId: regularUser.id,
          eventId: techEvent.id,
          seatType: 'NORMAL',
          quantity: 2,
          status: 'BOOKED',
          price: 49998.00,
          qrCode: 'TICKET-SAMPLE-QR-CODE-4'
        }
      ]
    });

    await prisma.event.update({
      where: { id: techEvent.id },
      data: { availableSeats: techEvent.availableSeats - 3 }
    });
  }

  const comedyEvent = await prisma.event.findFirst({
    where: { title: 'Comedy Night Special' }
  });

  if (comedyEvent) {
    await prisma.ticket.create({
      data: {
        userId: regularUser.id,
        eventId: comedyEvent.id,
        seatType: 'NORMAL',
        quantity: 4,
        status: 'BOOKED',
        price: 14996.00,
        qrCode: 'TICKET-SAMPLE-QR-CODE-5'
      }
    });

    await prisma.event.update({
      where: { id: comedyEvent.id },
      data: { availableSeats: comedyEvent.availableSeats - 4 }
    });
  }

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: regularUser.id,
        message: 'Your booking for Summer Music Festival 2025 has been confirmed!',
        type: 'BOOKING_CONFIRMED',
        status: 'UNREAD'
      },
      {
        userId: regularUser.id,
        message: 'Welcome! Your account has been created successfully.',
        type: 'BOOKING_CONFIRMED',
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
