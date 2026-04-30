import { NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { id } = params;
    const { title, description, venue, date, capacity, basePrice, category, image } = await request.json();

    // Validate input
    if (!title || !description || !venue || !date || !capacity || !basePrice || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
        image
      }
    });

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
