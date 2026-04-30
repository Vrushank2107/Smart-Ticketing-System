'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, MapPin, QrCode, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';

export default function MyTicketsPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (session) {
      fetchTickets();
    }
  }, [session]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets/my-tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    setTicketToCancel(ticketId);
    setShowConfirmModal(true);
  };

  const confirmCancelTicket = async () => {
    if (!ticketToCancel) return;

    try {
      const response = await fetch('/api/tickets/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: ticketToCancel }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Ticket cancelled successfully!');
        setShowConfirmModal(false);
        setTicketToCancel(null);
        fetchTickets();
      } else {
        toast.error(result.error || 'Cancellation failed');
        setShowConfirmModal(false);
        setTicketToCancel(null);
      }
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      toast.error('Failed to cancel ticket. Please try again.');
      setShowConfirmModal(false);
      setTicketToCancel(null);
    }
  };

  const cancelConfirmModal = () => {
    setShowConfirmModal(false);
    setTicketToCancel(null);
  };

  const showQRCode = (ticket) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED':
        return 'text-green-600 bg-green-100';
      case 'WAITLISTED':
        return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'BOOKED':
        return <CheckCircle className="h-4 w-4" />;
      case 'WAITLISTED':
        return <Clock className="h-4 w-4" />;
      case 'CANCELLED':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'ALL') return true;
    return ticket.status === filter;
  });

  if (!session) {
    return (
      <div className="glass-card rounded-[3rem] p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Please sign in to view your tickets</h2>
        <Link href="/auth/signin" className="btn btn-primary">
          Sign In
        </Link>
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
        <h1 className="text-4xl font-bold mb-2">
          <span className="gradient-text">My Tickets</span>
        </h1>
        <p className="text-gray-600 text-lg">Manage your event tickets and bookings</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-[3rem] p-6">
        <div className="flex flex-wrap gap-3">
          {['ALL', 'BOOKED', 'WAITLISTED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70 border border-gray-200'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
              {status !== 'ALL' && (
                <span className="ml-2 text-sm">
                  ({tickets.filter(t => t.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-12 text-center">
          <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-3">
            {filter === 'ALL' ? 'No tickets found' : `No ${filter.toLowerCase()} tickets`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'ALL' 
              ? 'Start by booking tickets for upcoming events' 
              : `You don't have any ${filter.toLowerCase()} tickets`}
          </p>
          {filter === 'ALL' && (
            <Link href="/" className="btn btn-primary">
              Browse Events
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="glass-feature slide-up">
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{ticket.status}</span>
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    {ticket.seatType}
                  </span>
                </div>

                {/* Event Info */}
                <h3 className="text-xl font-semibold mb-2">{ticket.event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(ticket.event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{ticket.event.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Quantity:</span>
                    <span>{ticket.quantity} tickets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Price:</span>
                    <span className="text-primary-600 font-semibold">₹{ticket.price}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {ticket.status === 'BOOKED' && (
                    <>
                      <button
                        onClick={() => showQRCode(ticket)}
                        className="flex-1 btn btn-primary flex items-center justify-center space-x-1"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>QR Code</span>
                      </button>
                      <button
                        onClick={() => handleCancelTicket(ticket.id)}
                        className="flex-1 btn btn-danger"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {ticket.status === 'WAITLISTED' && (
                    <div className="w-full text-center py-2 px-4 bg-yellow-50 text-yellow-700 rounded-lg">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Waitlisted - You'll be notified if a seat becomes available
                    </div>
                  )}
                  {ticket.status === 'CANCELLED' && (
                    <div className="w-full text-center py-2 px-4 bg-red-50 text-red-700 rounded-lg">
                      <X className="h-4 w-4 inline mr-1" />
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-8 fade-in shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Ticket QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                {selectedTicket.qrCode ? (
                  <img
                    src={selectedTicket.qrCode}
                    alt="Ticket QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 mx-auto flex items-center justify-center bg-white rounded-lg">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-800 space-y-1">
                <p className="font-semibold text-gray-900">{selectedTicket.event.title}</p>
                <p className="text-gray-700">{formatDate(selectedTicket.event.date)}</p>
                <p className="text-gray-700">{selectedTicket.event.venue}</p>
                <p className="mt-2 text-gray-600">Ticket ID: {selectedTicket.id}</p>
                <p className="text-gray-600">Quantity: {selectedTicket.quantity}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Please show this QR code at the venue for entry
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-8 fade-in shadow-2xl border border-gray-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">Cancel Ticket</h3>
              
              <p className="text-gray-600">
                Are you sure you want to cancel this ticket? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={cancelConfirmModal}
                  className="btn btn-outline px-6"
                >
                  No, Keep Ticket
                </button>
                <button
                  onClick={confirmCancelTicket}
                  className="btn btn-danger px-6"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
