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

    const { eventId, seatType, quantity, paymentDetails } = await request.json();

    // Validate input
    if (!eventId || !seatType || !quantity || !paymentDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Book ticket
    const result = await ticketingService.bookTicket(
      session.user.id,
      eventId,
      seatType,
      quantity,
      paymentDetails
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
