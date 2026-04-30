import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import NotificationService from '../../../../classes/NotificationService';

const notificationService = new NotificationService();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mark all notifications as read for the user
    const markedCount = await notificationService.markAllAsRead(session.user.id);

    return NextResponse.json(
      { 
        message: `${markedCount} notifications marked as read`,
        count: markedCount
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mark all notifications as read API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
