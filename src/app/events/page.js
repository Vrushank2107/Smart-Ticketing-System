'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, MapPin, Users, Clock, Star, Grid, List, SlidersHorizontal, ChevronDown, X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [userTickets, setUserTickets] = useState([]);

  const categories = ['Music', 'Sports', 'Theater', 'Comedy', 'Conference', 'Workshop'];
  const sortOptions = [
    { value: 'date', label: 'Date (Soonest First)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchEvents();
    if (session) {
      fetchUserTickets();
    }
  }, [session, router]);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchTerm, selectedCategory, selectedDate, priceRange, sortBy]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      // Ensure data is an array
      const eventsArray = Array.isArray(data) ? data : [];
      setEvents(eventsArray);
      setFilteredEvents(eventsArray);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const response = await fetch('/api/tickets/my-tickets');
      if (response.ok) {
        const ticketsData = await response.json();
        setUserTickets(ticketsData);
      }
    } catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  };

  const filterAndSortEvents = () => {
    // Ensure events is an array
    let filtered = Array.isArray(events) ? events : [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return eventDate === filterDate;
      });
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(event => event.basePrice >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(event => event.basePrice <= parseFloat(priceRange.max));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price-low':
          return a.basePrice - b.basePrice;
        case 'price-high':
          return b.basePrice - a.basePrice;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.capacity - b.availableSeats) - (a.capacity - a.availableSeats);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDate('');
    setPriceRange({ min: '', max: '' });
    setSortBy('date');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="py-8">
        <div className="glass-card rounded-[3rem] p-12">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="h-7 w-7 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Browse Events</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Discover Amazing Events</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find and book tickets for concerts, sports, theater, and more. Smart waitlist system ensures you never miss out!
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="glass-stat">
                <div className="text-3xl font-bold text-indigo-600">{events.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Events</div>
              </div>
              <div className="glass-stat">
                <div className="text-3xl font-bold text-indigo-600">{categories.length}</div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
              <div className="glass-stat">
                <div className="text-3xl font-bold text-indigo-600">{events.filter(e => e.availableSeats > 0).length}</div>
                <div className="text-sm text-gray-600 mt-1">Available Now</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="glass-card rounded-[3rem] p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events, venues, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Advanced Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            {(searchTerm || selectedCategory || selectedDate || priceRange.min || priceRange.max) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="9999"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="input w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-1">Events</h2>
          <p className="text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>
        {session && (
          <Link href="/my-tickets" className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 font-medium">
            <span>View My Tickets</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Events Display */}
      {filteredEvents.length === 0 ? (
        <div className="glass-card rounded-[3rem] p-12 text-center">
          <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-3">No events found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="btn btn-outline"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredEvents.map((event) => {
            const userTicket = session ? userTickets.find(t => t.eventId === event.id) : null;
            const isBooked = userTicket?.status === 'BOOKED';
            const isWaitlisted = userTicket?.status === 'WAITLISTED';
            
            if (viewMode === 'grid') {
              return (
                <div key={event.id} className={`glass-feature slide-up ${
                  isBooked ? 'ring-2 ring-green-500' : isWaitlisted ? 'ring-2 ring-orange-500' : ''
                }`}>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                        {event.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isBooked && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Booked
                          </span>
                        )}
                        {isWaitlisted && (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                            Waitlisted
                          </span>
                        )}
                        <span className={`text-sm font-medium ${getAvailabilityColor(event.availableSeats, event.capacity)}`}>
                          {getAvailabilityText(event.availableSeats, event.capacity)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.availableSeats} / {event.capacity} seats</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">Rs{event.basePrice}</span>
                        <span className="text-sm text-gray-500">/ticket</span>
                      </div>
                      {isBooked ? (
                        <span className="text-green-600 font-medium">Already Booked</span>
                      ) : isWaitlisted ? (
                        <span className="text-orange-600 font-medium">On Waitlist</span>
                      ) : (
                        <Link
                          href={`/events/${event.id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={event.id} className={`glass-feature slide-up ${
                  isBooked ? 'ring-2 ring-green-500' : isWaitlisted ? 'ring-2 ring-orange-500' : ''
                }`}>
                  <div className="flex flex-col md:flex-row">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full md:w-48 h-48 object-cover rounded-l-lg"
                      />
                    )}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                              {event.category}
                            </span>
                            {isBooked && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                Booked
                              </span>
                            )}
                            {isWaitlisted && (
                              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                Waitlisted
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">Rs{event.basePrice}</div>
                          <div className="text-sm text-gray-500">per ticket</div>
                          <div className={`text-sm font-medium mt-2 ${getAvailabilityColor(event.availableSeats, event.capacity)}`}>
                            {getAvailabilityText(event.availableSeats, event.capacity)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{event.availableSeats} / {event.capacity} seats</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        {isBooked ? (
                          <span className="text-green-600 font-medium">Already Booked</span>
                        ) : isWaitlisted ? (
                          <span className="text-orange-600 font-medium">On Waitlist</span>
                        ) : (
                          <Link
                            href={`/events/${event.id}`}
                            className="btn btn-primary"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
