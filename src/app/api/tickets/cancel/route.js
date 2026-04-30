import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import TicketingService from '../../../../services/TicketingService';

const ticketingService = new TicketingService();

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { ticketId } = await request.json();

    // Validate input
    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    // Cancel ticket
    const result = await ticketingService.cancelTicket(ticketId, session.user.id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Cancellation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
