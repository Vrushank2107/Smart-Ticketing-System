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
    const { language, timezone, dateFormat, currency } = body;

    // In a real application, you would store these settings in a separate userSettings table
    // For now, we'll just return success (you could extend the User model or create a new table)
    
    // Example of how you might store this if you had a userSettings table:
    /*
    await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        language,
        timezone,
        dateFormat,
        currency
      },
      create: {
        userId: session.user.id,
        language,
        timezone,
        dateFormat,
        currency
      }
    });
    */

    return Response.json({
      message: 'General settings updated successfully',
      settings: { language, timezone, dateFormat, currency }
    });

  } catch (error) {
    console.error('Error updating general settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real application, you would fetch from userSettings table
    const defaultSettings = {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    };

    return Response.json({ settings: defaultSettings });

  } catch (error) {
    console.error('Error fetching general settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
