import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import TicketingService from '../../../../../services/TicketingService';

const prisma = new PrismaClient();
const ticketingService = new TicketingService();

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { additionalSeats } = await request.json();

    // Validate input
    if (!additionalSeats || additionalSeats <= 0) {
      return NextResponse.json(
        { error: 'Additional seats must be a positive number' },
        { status: 400 }
      );
    }

    // Get current event
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update available seats (not capacity)
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        availableSeats: event.availableSeats + additionalSeats
      }
    });

    // Check and promote waitlisted users
    await ticketingService.checkAndPromoteWaitlist(id);

    return NextResponse.json({
      message: `Added ${additionalSeats} available seats`,
      event: updatedEvent
    }, { status: 200 });

  } catch (error) {
    console.error('Availability update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
