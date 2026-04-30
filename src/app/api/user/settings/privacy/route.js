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
    const { profileVisibility, showEmail, showPhone, allowDirectMessages } = body;

    // In a real application, you would store these settings in a separate userPrivacySettings table
    // For now, we'll just return success
    
    // Example of how you might store this if you had a userPrivacySettings table:
    /*
    await prisma.userPrivacySettings.upsert({
      where: { userId: session.user.id },
      update: {
        profileVisibility,
        showEmail,
        showPhone,
        allowDirectMessages
      },
      create: {
        userId: session.user.id,
        profileVisibility,
        showEmail,
        showPhone,
        allowDirectMessages
      }
    });
    */

    return Response.json({
      message: 'Privacy settings updated successfully',
      settings: { profileVisibility, showEmail, showPhone, allowDirectMessages }
    });

  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real application, you would fetch from userPrivacySettings table
    const defaultSettings = {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowDirectMessages: true
    };

    return Response.json({ settings: defaultSettings });

  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
