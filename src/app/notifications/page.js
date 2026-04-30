'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Check, CheckCircle, Calendar, Ticket, AlertCircle, X } from 'lucide-react';

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'READ' }
            : notif
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refetch notifications to get the updated state
        await fetchNotifications();
      } else {
        const data = await response.json();
        console.error('API returned error:', data.error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'WAITLIST_PROMOTION':
        return <Ticket className="h-5 w-5 text-blue-600" />;
      case 'CANCELLATION_CONFIRMED':
        return <X className="h-5 w-5 text-red-600" />;
      case 'EVENT_REMINDER':
        return <Calendar className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (status) => {
    return status === 'UNREAD' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  if (!session) {
    return (
      <div className="glass-card rounded-[3rem] p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Please sign in to view notifications</h2>
        <a href="/auth/signin" className="btn btn-primary">
          Sign In
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-[3rem] p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Notifications</span>
            </h1>
            <p className="text-gray-600 text-lg">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up! No new notifications.'
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-12 text-center">
          <Bell className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-3">No notifications yet</h3>
          <p className="text-gray-500">
            We'll notify you about booking confirmations, waitlist updates, and event reminders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-feature p-6 rounded-2xl transition-all hover:shadow-xl ${getNotificationColor(notification.status)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm ${notification.status === 'UNREAD' ? 'font-semibold' : 'font-normal'} text-gray-900`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.status === 'UNREAD' && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      {notification.status === 'READ' && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
