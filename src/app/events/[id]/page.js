'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, Star, CreditCard, Smartphone, Wallet, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../components/ToastContainer';

export default function EventDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    seatType: 'NORMAL',
    quantity: 1,
    paymentMethod: 'CARD',
    paymentDetails: {}
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateDynamicPrice = (basePrice, seatType, availableSeats, capacity) => {
    let price = basePrice;

    // Apply seat type multiplier
    switch (seatType) {
      case 'VIP':
        price *= 2.5;
        break;
      case 'PREMIUM':
        price *= 1.5;
        break;
      case 'NORMAL':
      default:
        price *= 1.0;
        break;
    }

    // Dynamic pricing based on availability
    const availabilityRatio = availableSeats / capacity;
    if (availabilityRatio < 0.1) {
      price *= 1.5; // 50% increase if less than 10% seats available
    } else if (availabilityRatio < 0.2) {
      price *= 1.3; // 30% increase if less than 20% seats available
    } else if (availabilityRatio < 0.5) {
      price *= 1.1; // 10% increase if less than 50% seats available
    }

    // Apply user discount
    if (session?.user?.role === 'VIP') {
      price *= 0.9; // 10% discount for VIP
    } else if (session?.user?.role === 'ADMIN') {
      price *= 0.8; // 20% discount for Admin
    }

    return Math.round(price * 100) / 100;
  };

  const handleBooking = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setProcessing(true);
    try {
      const totalPrice = calculateDynamicPrice(
        event.basePrice,
        bookingData.seatType,
        event.availableSeats,
        event.capacity
      ) * bookingData.quantity;

      const paymentDetails = {
        method: bookingData.paymentMethod,
        ticketId: `temp-${Date.now()}`
      };

      // Add payment method specific details
      if (bookingData.paymentMethod === 'CARD') {
        paymentDetails.cardNumber = '****-****-****-1234';
        paymentDetails.expiryDate = '12/25';
        paymentDetails.cvv = '123';
      } else if (bookingData.paymentMethod === 'UPI') {
        paymentDetails.upiId = 'user@upi';
      } else if (bookingData.paymentMethod === 'WALLET') {
        paymentDetails.walletType = 'PayTM';
        paymentDetails.walletNumber = '9876543210';
      }

      const response = await fetch('/api/tickets/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          seatType: bookingData.seatType,
          quantity: bookingData.quantity,
          paymentDetails
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Booking successful! ${result.message} Check your tickets for QR code.`);
        setShowBookingModal(false);
        router.push('/my-tickets');
      } else {
        toast.error(result.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailabilityColor = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityText = (available, capacity) => {
    const percentage = (available / capacity) * 100;
    if (percentage > 50) return 'Available';
    if (percentage > 20) return 'Filling Fast';
    return 'Almost Full';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="glass-card rounded-[3rem] p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Event not found</h2>
        <button onClick={() => router.push('/')} className="btn btn-primary">
          Back to Events
        </button>
      </div>
    );
  }

  const currentPrice = calculateDynamicPrice(
    event.basePrice,
    bookingData.seatType,
    event.availableSeats,
    event.capacity
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center">
        <button
          onClick={() => router.push('/events')}
          className="btn btn-outline flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Event Header */}
      <div className="glass-card rounded-[3rem] overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        )}
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <span className="glass-badge text-sm px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold mt-4 mb-2">{event.title}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-semibold ${getAvailabilityColor(event.availableSeats, event.capacity)}`}>
                  {getAvailabilityText(event.availableSeats, event.capacity)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  {event.availableSeats} / {event.capacity} seats
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">{event.capacity} seats</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-2xl font-semibold mb-4 gradient-text">About this Event</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="glass-card rounded-[3rem] p-8">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Book Your Tickets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seat Selection */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Select Seat Type</h3>
            <div className="space-y-3">
              {['NORMAL', 'PREMIUM'].map((seatType) => {
                const price = calculateDynamicPrice(event.basePrice, seatType, event.availableSeats, event.capacity);
                return (
                  <label key={seatType} className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    bookingData.seatType === seatType 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="seatType"
                      value={seatType}
                      checked={bookingData.seatType === seatType}
                      onChange={(e) => setBookingData({...bookingData, seatType: e.target.value})}
                      className="text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{seatType}</span>
                        <span className="text-primary-600 font-semibold">₹{price}</span>
                      </div>
                      {seatType === 'VIP' && (
                        <p className="text-sm text-gray-500">Best seats with premium experience</p>
                      )}
                      {seatType === 'PREMIUM' && (
                        <p className="text-sm text-gray-500">Great seats with good view</p>
                      )}
                      {seatType === 'NORMAL' && (
                        <p className="text-sm text-gray-500">Standard seating</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-6">
              <label className="label">Quantity</label>
              <select
                value={bookingData.quantity}
                onChange={(e) => setBookingData({...bookingData, quantity: parseInt(e.target.value)})}
                className="input"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              {event.availableSeats === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Select quantity for waitlist
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {[
                { value: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                { value: 'UPI', label: 'UPI Payment', icon: Smartphone },
                { value: 'WALLET', label: 'Digital Wallet', icon: Wallet }
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <label key={method.value} className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    bookingData.paymentMethod === method.value 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={bookingData.paymentMethod === method.value}
                      onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                      className="text-indigo-600"
                    />
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{method.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <h4 className="font-semibold mb-4 text-lg">Price Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price ({bookingData.seatType})</span>
                  <span className="font-medium">₹{currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">x{bookingData.quantity}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-indigo-200">
                  <span>Total</span>
                  <span className="gradient-text">
                    ₹{(currentPrice * bookingData.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="flex items-end space-x-4">
            <button
              onClick={handleBooking}
              disabled={processing}
              className="btn btn-primary text-lg px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : event.availableSeats === 0 ? 'Join Waitlist' : 'Book Now'}
            </button>
            {event.availableSeats === 0 && (
              <p className="text-sm text-gray-600 max-w-xs">
                Join the waitlist to be notified when tickets become available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
