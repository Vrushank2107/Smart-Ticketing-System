import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { title, description, venue, date, capacity, basePrice, category, image } = await request.json();

    // Validate input
    if (!title || !description || !venue || !date || !capacity || !basePrice || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Calculate new available seats if capacity changed
    const currentBookings = await prisma.ticket.count({
      where: {
        eventId: id,
        status: 'BOOKED'
      }
    });

    if (capacity < currentBookings) {
      return NextResponse.json(
        { error: 'Cannot reduce capacity below current bookings' },
        { status: 400 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        venue,
        date: new Date(date),
        capacity,
        availableSeats: capacity - currentBookings,
        basePrice,
        category,
        image
      }
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Update event API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
