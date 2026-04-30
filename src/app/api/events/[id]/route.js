import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { PrismaClient } from '@prisma/client';
import TicketingService from '../../../../services/TicketingService';

const prisma = new PrismaClient();
const ticketingService = new TicketingService();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        },
        waitlist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Event API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { title, description, venue, date, capacity, availableSeats, basePrice, category, image } = await request.json();

    // Validate input
    if (!title || !description || !venue || !date || !capacity || !basePrice || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate available seats
    if (availableSeats !== undefined && (availableSeats < 0 || availableSeats > capacity)) {
      return NextResponse.json(
        { error: 'Available seats must be between 0 and capacity' },
        { status: 400 }
      );
    }

    // Get current event to check if capacity increased
    const currentEvent = await prisma.event.findUnique({ where: { id } });
    if (!currentEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const capacityIncreased = capacity > currentEvent.capacity;

    // Update event
    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        venue,
        date: new Date(date),
        capacity,
        basePrice,
        category,
        image,
        // Handle available seats
        ...(availableSeats !== undefined 
          ? { availableSeats }
          : capacityIncreased 
            ? { availableSeats: currentEvent.availableSeats + (capacity - currentEvent.capacity) }
            : {}
        )
      }
    });

    // If capacity increased, check and promote waitlisted users
    if (capacityIncreased) {
      await ticketingService.checkAndPromoteWaitlist(id);
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Update event API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if event has booked tickets
    const bookedTickets = await prisma.ticket.count({
      where: {
        eventId: id,
        status: 'BOOKED'
      }
    });

    if (bookedTickets > 0) {
      return NextResponse.json(
        { error: 'Cannot delete event with booked tickets' },
        { status: 400 }
      );
    }

    // Delete event (cascade will handle tickets and waitlist)
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete event API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
