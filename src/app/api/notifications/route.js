import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import TicketingService from '../../../services/TicketingService';

const prisma = new PrismaClient();

const ticketingService = new TicketingService();

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user notifications
    const notifications = await ticketingService.getUserNotifications(session.user.id);

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Mark notification as read
    await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'READ' }
    });

    return NextResponse.json(
      { message: 'Notification marked as read' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
