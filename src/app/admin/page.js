'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Ticket, 
  DollarSign, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin, 
  Star, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ArrowLeft,
  X
} from 'lucide-react';
import { useToast } from '../../components/ToastContainer';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeEvents: 0
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    capacity: '',
    basePrice: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    if (session) {
      if (session.user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch events
      const eventsResponse = await fetch('/api/events');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      // Fetch analytics data
      const analyticsResponse = await fetch('/api/admin/analytics');
      const analyticsData = await analyticsResponse.json();

      // Fetch user data
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();

      setStats({
        totalUsers: usersData.count || 0,
        totalBookings: analyticsData.bookings.total || 0,
        totalRevenue: analyticsData.revenue.total || 0,
        activeEvents: analyticsData.events.upcoming || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          venue: '',
          date: '',
          capacity: '',
          basePrice: '',
          category: '',
          image: ''
        });
        fetchDashboardData();
        toast.success('Event created successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleEditEvent = async (event) => {
    setEventToEdit(event);
    setFormData({
      title: event.title,
      description: event.description,
      venue: event.venue,
      date: new Date(event.date).toISOString().slice(0, 16),
      capacity: event.capacity,
      basePrice: event.basePrice,
      category: event.category,
      image: event.image || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/events/${eventToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEventToEdit(null);
        setFormData({
          title: '',
          description: '',
          venue: '',
          date: '',
          capacity: '',
          basePrice: '',
          category: '',
          image: ''
        });
        fetchDashboardData();
        toast.success('Event updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      const response = await fetch(`/api/events/${eventToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDashboardData();
        toast.success('Event deleted successfully');
        setShowDeleteModal(false);
        setEventToDelete(null);
      } else {
        toast.error('Failed to delete event');
        setShowDeleteModal(false);
        setEventToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const cancelDeleteModal = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!session) {
    return (
      <div className="glass-card rounded-[3rem] p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Please sign in to access admin dashboard</h2>
        <Link href="/auth/signin" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (session.user.role !== 'ADMIN') {
    return (
      <div className="glass-card rounded-[3rem] p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Access Denied</h2>
        <p className="text-gray-500 mb-4">You don't have permission to access this page</p>
        <Link href="/" className="btn btn-primary">
          Go Home
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-gray-600 text-lg">Manage events and monitor system performance</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalBookings}</p>
              <p className="text-xs text-gray-500 mt-1">Confirmed tickets</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Ticket className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-indigo-600">₹{stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">All time revenue</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-stat">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Events</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.activeEvents}</p>
              <p className="text-xs text-gray-500 mt-1">Upcoming events</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="glass-card rounded-[3rem] p-8">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Events Management</h2>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No events found</h3>
            <p className="text-gray-500 mb-6">Create your first event to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Event</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Venue</th>
                  <th className="text-left py-3 px-4">Capacity</th>
                  <th className="text-left py-3 px-4">Available</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const isUpcoming = new Date(event.date) > new Date();
                  const isAlmostFull = (event.availableSeats / event.capacity) < 0.2;
                  
                  return (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(event.date)}</td>
                      <td className="py-3 px-4">{event.venue}</td>
                      <td className="py-3 px-4">{event.capacity}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${isAlmostFull ? 'text-red-600' : 'text-green-600'}`}>
                          {event.availableSeats}
                        </span>
                      </td>
                      <td className="py-3 px-4">₹{event.basePrice}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isUpcoming 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isUpcoming ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Upcoming
                            </>
                          ) : (
                            'Past'
                          )}
                        </span>
                        {isAlmostFull && isUpcoming && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Almost Full
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-[3rem] max-w-2xl w-full max-h-screen overflow-y-auto p-8 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Event</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input"
                  >
                    <option value="">Select category</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Theater">Theater</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="label">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="input"
                    placeholder="Enter venue"
                  />
                </div>

                <div>
                  <label className="label">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="input"
                    placeholder="Enter capacity"
                  />
                </div>

                <div>
                  <label className="label">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                    className="input"
                    placeholder="Enter base price in rupees"
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  placeholder="Enter event description"
                />
              </div>

              <div>
                <label className="label">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="input"
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-[3rem] max-w-2xl w-full max-h-screen overflow-y-auto p-8 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Event</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEventToEdit(null);
                  setFormData({
                    title: '',
                    description: '',
                    venue: '',
                    date: '',
                    capacity: '',
                    basePrice: '',
                    category: '',
                    image: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="input"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input"
                  >
                    <option value="">Select category</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Theater">Theater</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="label">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="input"
                    placeholder="Enter venue"
                  />
                </div>

                <div>
                  <label className="label">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="input"
                    placeholder="Enter capacity"
                  />
                </div>

                <div>
                  <label className="label">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                    className="input"
                    placeholder="Enter base price in rupees"
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  placeholder="Enter event description"
                />
              </div>

              <div>
                <label className="label">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="input"
                  placeholder="Enter image URL"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEventToEdit(null);
                    setFormData({
                      title: '',
                      description: '',
                      venue: '',
                      date: '',
                      capacity: '',
                      basePrice: '',
                      category: '',
                      image: ''
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-8 fade-in shadow-2xl border border-gray-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">Delete Event</h3>
              
              <p className="text-gray-600">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  onClick={cancelDeleteModal}
                  className="btn btn-outline px-6"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteEvent}
                  className="btn btn-danger px-6"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
