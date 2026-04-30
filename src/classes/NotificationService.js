/**
 * NotificationService class demonstrating ABSTRACTION
 * Abstracts the complexity of sending notifications
 * Provides a simple interface for different types of notifications
 */
class NotificationService {
  constructor() {
    this.notifications = []; // In-memory storage (in real app, this would be database)
  }

  /**
   * Send booking confirmation notification
   * Abstraction: Hides the complexity of notification creation and delivery
   */
  sendBookingConfirmation(userId, ticketId, eventName, eventDate) {
    const message = `Your ticket for "${eventName}" on ${eventDate} has been confirmed! Ticket ID: ${ticketId}`;
    const notification = this.createNotification(userId, message, 'BOOKING_CONFIRMED');
    
    console.log(`[NOTIFICATION] Booking confirmation sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send waitlist promotion notification
   * Abstraction: Hides the complexity of waitlist promotion notification
   */
  sendWaitlistPromotion(userId, ticketId, eventName, eventDate) {
    const message = `Great news! Your waitlisted ticket for "${eventName}" on ${eventDate} has been promoted to confirmed booking! Ticket ID: ${ticketId}`;
    const notification = this.createNotification(userId, message, 'WAITLIST_PROMOTION');
    
    console.log(`[NOTIFICATION] Waitlist promotion sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send cancellation confirmation notification
   * Abstraction: Hides the complexity of cancellation notification
   */
  sendCancellationConfirmation(userId, ticketId, eventName, eventDate) {
    const message = `Your ticket for "${eventName}" on ${eventDate} has been cancelled. Refund will be processed shortly. Ticket ID: ${ticketId}`;
    const notification = this.createNotification(userId, message, 'CANCELLATION_CONFIRMED');
    
    console.log(`[NOTIFICATION] Cancellation confirmation sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send event reminder notification
   * Abstraction: Hides the complexity of event reminder notification
   */
  sendEventReminder(userId, ticketId, eventName, eventDate, venue) {
    const message = `Reminder: Your event "${eventName}" is scheduled for ${eventDate} at ${venue}. Ticket ID: ${ticketId}`;
    const notification = this.createNotification(userId, message, 'EVENT_REMINDER');
    
    console.log(`[NOTIFICATION] Event reminder sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Send custom notification
   * Abstraction: Provides a simple interface for custom notifications
   */
  sendCustomNotification(userId, message, type = 'CUSTOM') {
    const notification = this.createNotification(userId, message, type);
    
    console.log(`[NOTIFICATION] Custom notification sent to user ${userId}: ${message}`);
    return notification;
  }

  /**
   * Private method to create notification object
   * Encapsulation: Internal method hidden from external users
   */
  createNotification(userId, message, type) {
    const notification = {
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      message,
      type,
      status: 'UNREAD',
      createdAt: new Date()
    };

    this.notifications.push(notification);
    return notification;
  }

  /**
   * Get all notifications for a user
   */
  getUserNotifications(userId) {
    return this.notifications.filter(notif => notif.userId === userId);
  }

  /**
   * Get unread notifications for a user
   */
  getUnreadNotifications(userId) {
    return this.notifications.filter(notif => 
      notif.userId === userId && notif.status === 'UNREAD'
    );
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId) {
    const notification = this.notifications.find(notif => notif.id === notificationId);
    if (notification) {
      notification.status = 'READ';
      return true;
    }
    return false;
  }

  /**
   * Mark all notifications for a user as read
   */
  markAllAsRead(userId) {
    const userNotifications = this.notifications.filter(notif => notif.userId === userId);
    userNotifications.forEach(notif => {
      notif.status = 'READ';
    });
    return userNotifications.length;
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId) {
    const index = this.notifications.findIndex(notif => notif.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get notification statistics
   */
  getNotificationStats(userId) {
    const userNotifications = this.notifications.filter(notif => notif.userId === userId);
    const unreadCount = userNotifications.filter(notif => notif.status === 'UNREAD').length;
    
    return {
      total: userNotifications.length,
      unread: unreadCount,
      read: userNotifications.length - unreadCount
    };
  }
}

module.exports = NotificationService;
