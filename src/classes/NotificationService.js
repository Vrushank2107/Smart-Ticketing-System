/**
 * NotificationService class demonstrating ABSTRACTION
 * Abstracts the complexity of sending notifications
 * Provides a simple interface for different types of notifications
 */
import { PrismaClient } from '@prisma/client';

class NotificationService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Send booking confirmation notification
   * Abstraction: Hides the complexity of notification creation and delivery
   */
  async sendBookingConfirmation(userId, ticketId, eventName, eventDate) {
    const message = `Your ticket for "${eventName}" on ${new Date(eventDate).toLocaleDateString()} has been confirmed! Ticket ID: ${ticketId}`;
    const notification = await this.createNotification(userId, message, 'BOOKING_CONFIRMED');
    
    console.log(`[NOTIFICATION] Booking confirmation sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send waitlist promotion notification
   * Abstraction: Hides the complexity of waitlist promotion notification
   */
  async sendWaitlistPromotion(userId, ticketId, eventName, eventDate) {
    const message = `Great news! Your waitlisted ticket for "${eventName}" on ${new Date(eventDate).toLocaleDateString()} has been promoted to confirmed booking! Ticket ID: ${ticketId}`;
    const notification = await this.createNotification(userId, message, 'WAITLIST_PROMOTION');
    
    console.log(`[NOTIFICATION] Waitlist promotion sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send cancellation confirmation notification
   * Abstraction: Hides the complexity of cancellation notification
   */
  async sendCancellationConfirmation(userId, ticketId, eventName, eventDate) {
    const message = `Your ticket for "${eventName}" on ${new Date(eventDate).toLocaleDateString()} has been cancelled. Refund will be processed shortly. Ticket ID: ${ticketId}`;
    const notification = await this.createNotification(userId, message, 'CANCELLATION_CONFIRMED');
    
    console.log(`[NOTIFICATION] Cancellation confirmation sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send event reminder notification
   * Abstraction: Hides the complexity of event reminder notification
   */
  async sendEventReminder(userId, ticketId, eventName, eventDate, venue) {
    const message = `Reminder: Your event "${eventName}" is scheduled for ${new Date(eventDate).toLocaleDateString()} at ${venue}. Ticket ID: ${ticketId}`;
    const notification = await this.createNotification(userId, message, 'EVENT_REMINDER');
    
    console.log(`[NOTIFICATION] Event reminder sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send custom notification
   * Abstraction: Provides a simple interface for custom notifications
   */
  async sendCustomNotification(userId, message, type = 'BOOKING_CONFIRMED') {
    const notification = await this.createNotification(userId, message, type);
    
    console.log(`[NOTIFICATION] Custom notification sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Private method to create notification object
   * Encapsulation: Internal method hidden from external users
   */
  async createNotification(userId, message, type) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        message,
        type,
        status: 'UNREAD'
      }
    });

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId) {
    return await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId) {
    return await this.prisma.notification.findMany({
      where: {
        userId,
        status: 'UNREAD'
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const notification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'READ' }
      });
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  }

  /**
   * Mark all notifications for a user as read
   */
  async markAllAsRead(userId) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        status: 'UNREAD'
      },
      data: { status: 'READ' }
    });

    return result.count;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    try {
      await this.prisma.notification.delete({
        where: { id: notificationId }
      });
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId) {
    const total = await this.prisma.notification.count({
      where: { userId }
    });

    const unread = await this.prisma.notification.count({
      where: {
        userId,
        status: 'UNREAD'
      }
    });

    return {
      total,
      unread,
      read: total - unread
    };
  }
}

export default NotificationService;
