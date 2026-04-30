/**
 * TicketingService - Core business logic for the ticketing system
 * Demonstrates the main automation logic and OOP concepts
 */
import { PrismaClient } from '@prisma/client';
import { Event } from '../classes/Event';
import { Ticket } from '../classes/Ticket';
import { User, RegularUser, VIPUser, AdminUser } from '../classes/User';
import { CardPayment, UpiPayment, WalletPayment } from '../classes/Payment';
import NotificationService from '../classes/NotificationService';
import QRCode from 'qrcode';

const prisma = new PrismaClient();
const notificationService = new NotificationService();

class TicketingService {
  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Book a ticket with capacity management and waitlist automation
   * This is the core method that demonstrates the main logic
   */
  async bookTicket(userId, eventId, seatType, quantity, paymentDetails) {
    try {
      // Get user and event from database
      const userRecord = await prisma.user.findUnique({ where: { id: userId } });
      const eventRecord = await prisma.event.findUnique({ where: { id: eventId } });

      if (!userRecord || !eventRecord) {
        throw new Error('User or Event not found');
      }

      // Create OOP instances
      const user = this.createUserInstance(userRecord);
      const event = new Event(
        eventRecord.id,
        eventRecord.title,
        eventRecord.description,
        eventRecord.venue,
        eventRecord.date,
        eventRecord.capacity,
        eventRecord.basePrice,
        eventRecord.category
      );

      // Set current available seats
      event.availableSeats = eventRecord.availableSeats;

      // Calculate dynamic price
      const basePrice = event.calculateDynamicPrice(seatType);
      const discount = user.getDiscount();
      const finalPrice = basePrice * (1 - discount) * quantity;

      // Process payment using polymorphism
      const payment = this.createPaymentInstance(finalPrice, userId, paymentDetails);
      const paymentSuccess = payment.processPayment();

      if (!paymentSuccess) {
        throw new Error('Payment failed');
      }

      // Check if seats are available
      if (event.hasAvailableSeats(quantity)) {
        // Book the ticket directly
        const ticket = await this.createConfirmedTicket(userId, eventId, seatType, quantity, finalPrice);
        
        // Update event available seats
        await prisma.event.update({
          where: { id: eventId },
          data: { availableSeats: eventRecord.availableSeats - quantity }
        });

        // Send booking confirmation
        this.notificationService.sendBookingConfirmation(
          userId,
          ticket.id,
          eventRecord.title,
          eventRecord.date
        );

        return {
          success: true,
          ticket,
          message: 'Booking confirmed successfully'
        };
      } else {
        // Add to waitlist
        const waitlistPosition = await this.addToWaitlist(userId, eventId);
        const ticket = await this.createWaitlistedTicket(userId, eventId, seatType, quantity, finalPrice);

        return {
          success: true,
          ticket,
          waitlistPosition,
          message: 'Added to waitlist successfully'
        };
      }
    } catch (error) {
      console.error('Booking error:', error);
      throw error;
    }
  }

  /**
   * Cancel a ticket and promote waitlisted user if available
   * This demonstrates the waitlist automation logic
   */
  async cancelTicket(ticketId, userId) {
    try {
      // Get ticket details
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { event: true }
      });

      if (!ticket || ticket.userId !== userId) {
        throw new Error('Ticket not found or unauthorized');
      }

      if (ticket.status === 'CANCELLED') {
        throw new Error('Ticket already cancelled');
      }

      // Update ticket status
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'CANCELLED' }
      });

      // Update event available seats
      await prisma.event.update({
        where: { id: ticket.eventId },
        data: { availableSeats: ticket.event.availableSeats + ticket.quantity }
      });

      // Send cancellation confirmation
      this.notificationService.sendCancellationConfirmation(
        userId,
        ticketId,
        ticket.event.title,
        ticket.event.date
      );

      // PROMOTE WAITLISTED USER - This is the core automation logic
      await this.promoteWaitlistedUser(ticket.eventId, ticket.quantity);

      return {
        success: true,
        message: 'Ticket cancelled successfully'
      };
    } catch (error) {
      console.error('Cancellation error:', error);
      throw error;
    }
  }

  /**
   * Promote first waitlisted user when vacancy occurs
   * This demonstrates the waitlist automation with VIP priority
   */
  async promoteWaitlistedUser(eventId, quantity) {
    try {
      // Get waitlist ordered by user priority (VIP first)
      const waitlist = await prisma.waitlist.findMany({
        where: { eventId },
        include: { user: true },
        orderBy: [
          { user: { role: 'desc' } } // VIP users first
        ]
      });

      if (waitlist.length === 0) {
        return; // No one in waitlist
      }

      // Get first user from waitlist
      const firstWaitlisted = waitlist[0];
      
      // Get their waitlisted ticket
      const waitlistedTicket = await prisma.ticket.findFirst({
        where: {
          userId: firstWaitlisted.userId,
          eventId: eventId,
          status: 'WAITLISTED'
        }
      });

      if (waitlistedTicket) {
        // Promote to booked
        await prisma.ticket.update({
          where: { id: waitlistedTicket.id },
          data: { status: 'BOOKED' }
        });

        // Remove from waitlist
        await prisma.waitlist.delete({
          where: { id: firstWaitlisted.id }
        });

        // Update event available seats
        await prisma.event.update({
          where: { id: eventId },
          data: { availableSeats: { decrement: waitlistedTicket.quantity } }
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(`TICKET-${waitlistedTicket.id}`);
        await prisma.ticket.update({
          where: { id: waitlistedTicket.id },
          data: { qrCode }
        });

        // Send promotion notification
        this.notificationService.sendWaitlistPromotion(
          firstWaitlisted.userId,
          waitlistedTicket.id,
          waitlistedTicket.event.title,
          waitlistedTicket.event.date
        );

        console.log(`Promoted user ${firstWaitlisted.userId} from waitlist for event ${eventId}`);
      }
    } catch (error) {
      console.error('Waitlist promotion error:', error);
    }
  }

  /**
   * Create user instance based on role (demonstrates polymorphism)
   */
  createUserInstance(userRecord) {
    switch (userRecord.role) {
      case 'VIP':
        return new VIPUser(userRecord.id, userRecord.name, userRecord.email);
      case 'ADMIN':
        return new AdminUser(userRecord.id, userRecord.name, userRecord.email);
      case 'REGULAR':
      default:
        return new RegularUser(userRecord.id, userRecord.name, userRecord.email);
    }
  }

  /**
   * Create payment instance based on payment method (demonstrates polymorphism)
   */
  createPaymentInstance(amount, userId, paymentDetails) {
    switch (paymentDetails.method) {
      case 'CARD':
        return new CardPayment(
          amount,
          userId,
          paymentDetails.ticketId,
          paymentDetails.cardNumber,
          paymentDetails.expiryDate,
          paymentDetails.cvv
        );
      case 'UPI':
        return new UpiPayment(
          amount,
          userId,
          paymentDetails.ticketId,
          paymentDetails.upiId
        );
      case 'WALLET':
        return new WalletPayment(
          amount,
          userId,
          paymentDetails.ticketId,
          paymentDetails.walletType,
          paymentDetails.walletNumber
        );
      default:
        throw new Error('Invalid payment method');
    }
  }

  /**
   * Create a confirmed ticket
   */
  async createConfirmedTicket(userId, eventId, seatType, quantity, price) {
    const ticket = await prisma.ticket.create({
      data: {
        userId,
        eventId,
        seatType,
        quantity,
        status: 'BOOKED',
        price
      }
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(`TICKET-${ticket.id}`);
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { qrCode }
    });

    return ticket;
  }

  /**
   * Create a waitlisted ticket
   */
  async createWaitlistedTicket(userId, eventId, seatType, quantity, price) {
    return await prisma.ticket.create({
      data: {
        userId,
        eventId,
        seatType,
        quantity,
        status: 'WAITLISTED',
        price
      }
    });
  }

  /**
   * Add user to waitlist
   */
  async addToWaitlist(userId, eventId) {
    // Get current position
    const currentPosition = await prisma.waitlist.count({
      where: { eventId }
    });

    await prisma.waitlist.create({
      data: {
        userId,
        eventId,
        position: currentPosition + 1
      }
    });

    return currentPosition + 1;
  }

  /**
   * Get user tickets
   */
  async getUserTickets(userId) {
    return await prisma.ticket.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export default TicketingService;
