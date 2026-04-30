import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import TicketingService from '../../../../services/TicketingService';

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

    // Get user tickets
    const tickets = await ticketingService.getUserTickets(session.user.id);

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error('My tickets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
