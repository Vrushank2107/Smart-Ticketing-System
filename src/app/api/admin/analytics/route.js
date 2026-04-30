import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get event statistics
    const totalEvents = await prisma.event.count();
    const upcomingEvents = await prisma.event.count({
      where: {
        date: {
          gte: new Date()
        }
      }
    });
    const pastEvents = totalEvents - upcomingEvents;

    // Get ticket statistics
    const totalBookings = await prisma.ticket.count({
      where: { status: 'BOOKED' }
    });
    const totalWaitlist = await prisma.waitlist.count();
    
    // Get revenue statistics
    const bookedTickets = await prisma.ticket.findMany({
      where: { status: 'BOOKED' },
      select: { price: true }
    });
    const totalRevenue = bookedTickets.reduce((sum, ticket) => sum + ticket.price, 0);

    // Get events by category
    const eventsByCategory = await prisma.event.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(price) as revenue
      FROM "Ticket" 
      WHERE "status" = 'BOOKED' 
        AND "createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
    `;

    // Get recent bookings
    const recentBookings = await prisma.ticket.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        event: {
          select: { title: true, date: true }
        }
      }
    });

    return NextResponse.json({
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        past: pastEvents,
        byCategory: eventsByCategory
      },
      bookings: {
        total: totalBookings,
        waitlist: totalWaitlist
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue
      },
      recentBookings
    }, { status: 200 });
  } catch (error) {
    console.error('Admin analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
