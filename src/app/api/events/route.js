import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const date = searchParams.get('date');

    // Build filter conditions
    const where = {
      date: { gte: new Date() }, // Only upcoming events
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.date = {
        gte: targetDate,
        lt: nextDay
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'asc' }
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { title, description, venue, date, capacity, basePrice, category, image } = await request.json();

    // Validate input
    if (!title || !description || !venue || !date || !capacity || !basePrice || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        venue,
        date: new Date(date),
        capacity,
        availableSeats: capacity,
        basePrice,
        category,
        image
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
