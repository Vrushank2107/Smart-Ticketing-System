const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('Resetting database...');
  
  try {
    // Delete all data in correct order to respect foreign key constraints
    await prisma.notification.deleteMany({});
    console.log('Deleted notifications');
    
    await prisma.ticket.deleteMany({});
    console.log('Deleted tickets');
    
    await prisma.waitlist.deleteMany({});
    console.log('Deleted waitlist entries');
    
    await prisma.event.deleteMany({});
    console.log('Deleted events');
    
    await prisma.user.deleteMany({});
    console.log('Deleted users');
    
    // Run the seed script
    console.log('Running seed script...');
    await require('./prisma/seed.js');
    
    console.log('Database reset and seeded successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
