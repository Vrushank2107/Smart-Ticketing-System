import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      emailNotifications, 
      pushNotifications, 
      bookingConfirmations, 
      eventReminders, 
      waitlistUpdates, 
      promotionalEmails 
    } = body;

    // In a real application, you would store these settings in a separate userNotificationSettings table
    // For now, we'll just return success
    
    // Example of how you might store this if you had a userNotificationSettings table:
    /*
    await prisma.userNotificationSettings.upsert({
      where: { userId: session.user.id },
      update: {
        emailNotifications,
        pushNotifications,
        bookingConfirmations,
        eventReminders,
        waitlistUpdates,
        promotionalEmails
      },
      create: {
        userId: session.user.id,
        emailNotifications,
        pushNotifications,
        bookingConfirmations,
        eventReminders,
        waitlistUpdates,
        promotionalEmails
      }
    });
    */

    return Response.json({
      message: 'Notification settings updated successfully',
      settings: { 
        emailNotifications, 
        pushNotifications, 
        bookingConfirmations, 
        eventReminders, 
        waitlistUpdates, 
        promotionalEmails 
      }
    });

  } catch (error) {
    console.error('Error updating notification settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real application, you would fetch from userNotificationSettings table
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: true,
      bookingConfirmations: true,
      eventReminders: true,
      waitlistUpdates: true,
      promotionalEmails: false
    };

    return Response.json({ settings: defaultSettings });

  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
