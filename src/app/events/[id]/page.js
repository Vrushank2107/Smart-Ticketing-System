'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, Star, CreditCard, Smartphone, Wallet } from 'lucide-react';

export default function EventDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
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
        alert(result.message);
        setShowBookingModal(false);
        router.push('/my-tickets');
      } else {
        alert(result.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
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
      <div className="text-center py-12">
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
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <span className="text-sm px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                {event.category}
              </span>
              <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-medium ${getAvailabilityColor(event.availableSeats, event.capacity)}`}>
                  {getAvailabilityText(event.availableSeats, event.capacity)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  {event.availableSeats} / {event.capacity} seats
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">{event.capacity} seats</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3">About this Event</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Book Your Tickets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seat Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Seat Type</h3>
            <div className="space-y-3">
              {['NORMAL', 'PREMIUM', 'VIP'].map((seatType) => {
                const price = calculateDynamicPrice(event.basePrice, seatType, event.availableSeats, event.capacity);
                return (
                  <label key={seatType} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="seatType"
                      value={seatType}
                      checked={bookingData.seatType === seatType}
                      onChange={(e) => setBookingData({...bookingData, seatType: e.target.value})}
                      className="text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{seatType}</span>
                        <span className="text-primary-600 font-semibold">${price}</span>
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
                max={Math.min(event.availableSeats, 10)}
              >
                {[...Array(Math.min(event.availableSeats, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              {[
                { value: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                { value: 'UPI', label: 'UPI Payment', icon: Smartphone },
                { value: 'WALLET', label: 'Digital Wallet', icon: Wallet }
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <label key={method.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={bookingData.paymentMethod === method.value}
                      onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                      className="text-primary-600"
                    />
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{method.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Price Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price ({bookingData.seatType})</span>
                  <span>${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>x{bookingData.quantity}</span>
                </div>
                {session?.user?.role === 'VIP' && (
                  <div className="flex justify-between text-green-600">
                    <span>VIP Discount (10%)</span>
                    <span>-${(currentPrice * bookingData.quantity * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${(currentPrice * bookingData.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleBooking}
            disabled={processing || event.availableSeats === 0}
            className="btn btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
