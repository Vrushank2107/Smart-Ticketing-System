/**
 * EventReminderService - Handles automated event reminders
 * This service runs periodically to check for upcoming events and send reminders
 */
import { PrismaClient } from '@prisma/client';
import NotificationService from '../classes/NotificationService';

class EventReminderService {
  constructor() {
    this.prisma = new PrismaClient();
    this.notificationService = new NotificationService();
  }

  /**
   * Check for upcoming events and send reminders
   * This should be called by a cron job or scheduler
   */
  async sendEventReminders() {
    try {
      console.log('[EVENT_REMINDER] Checking for upcoming events...');
      
      // Get events happening in the next 24 hours
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const upcomingEvents = await this.prisma.event.findMany({
        where: {
          date: {
            gte: new Date(),
            lte: tomorrow
          }
        },
        include: {
          tickets: {
            where: {
              status: 'BOOKED'
            },
            include: {
              user: true
            }
          }
        }
      });

      for (const event of upcomingEvents) {
        for (const ticket of event.tickets) {
          // Check if we already sent a reminder for this event to this user
          const existingReminder = await this.prisma.notification.findFirst({
            where: {
              userId: ticket.userId,
              type: 'EVENT_REMINDER',
              message: {
                contains: event.title,
                contains: ticket.id
              }
            }
          });

          if (!existingReminder) {
            await this.notificationService.sendEventReminder(
              ticket.userId,
              ticket.id,
              event.title,
              event.date,
              event.venue
            );
            console.log(`[EVENT_REMINDER] Sent reminder for event "${event.title}" to user ${ticket.userId}`);
          }
        }
      }

      console.log(`[EVENT_REMINDER] Processed ${upcomingEvents.length} upcoming events`);
    } catch (error) {
      console.error('[EVENT_REMINDER] Error sending reminders:', error);
    }
  }

  /**
   * Send reminder for a specific event (manual trigger)
   */
  async sendReminderForEvent(eventId) {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: {
          tickets: {
            where: {
              status: 'BOOKED'
            },
            include: {
              user: true
            }
          }
        }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      for (const ticket of event.tickets) {
        await this.notificationService.sendEventReminder(
          ticket.userId,
          ticket.id,
          event.title,
          event.date,
          event.venue
        );
      }

      return {
        success: true,
        message: `Reminders sent to ${event.tickets.length} users for event "${event.title}"`
      };
    } catch (error) {
      console.error('Error sending manual reminder:', error);
      throw error;
    }
  }
}

export default EventReminderService;
