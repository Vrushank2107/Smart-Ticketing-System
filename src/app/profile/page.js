'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Edit2, Save, X, Camera, MapPin, Phone, Globe, Briefcase } from 'lucide-react';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    company: ''
  });
  const [profileData, setProfileData] = useState(null);
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        location: '',
        bio: '',
        website: '',
        company: ''
      });
      fetchUserTickets();
    }
  }, [session]);

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

  const bookedTicketsCount = userTickets.filter(t => t.status === 'BOOKED').length;
  const attendedEventsCount = userTickets.filter(t => t.status === 'BOOKED' && new Date(t.event.date) < new Date()).length;

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Website must start with http:// or https://';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Update session with new data after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
    setValidationErrors({});
    setFormData({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      location: '',
      bio: '',
      website: '',
      company: ''
    });
    setIsEditing(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-[3rem] p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Error and Success Messages */}
      <ErrorMessage message={error} onDismiss={() => setError('')} />
      <SuccessMessage message={success} onDismiss={() => setSuccess('')} />

      {/* Header */}
      <div className="glass-card rounded-[3rem] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary-600" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <p className="text-primary-100">{session.user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                {session.user.role}
              </span>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span className="font-medium">{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="font-medium">Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="glass-card rounded-[3rem] p-8">
        <h2 className="text-2xl font-semibold mb-6 gradient-text">Profile Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{formData.name || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="New York, NY"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <div className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{formData.location || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <div>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        validationErrors.website ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.website && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.website}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{formData.website || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <div className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{formData.company || 'Not provided'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]">
              <p className="text-gray-900">{formData.bio || 'No bio provided'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Statistics */}
      <div className="glass-card rounded-[3rem] p-8">
        <h2 className="text-2xl font-semibold mb-6 gradient-text">Account Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-stat">
            <div className="text-3xl font-bold text-indigo-600">{bookedTicketsCount}</div>
            <div className="text-sm text-gray-600 mt-2">Tickets Booked</div>
          </div>
          <div className="glass-stat">
            <div className="text-3xl font-bold text-indigo-600">{attendedEventsCount}</div>
            <div className="text-sm text-gray-600 mt-2">Events Attended</div>
          </div>
          <div className="glass-stat">
            <div className="text-3xl font-bold text-indigo-600">
              {Math.floor((Date.now() - new Date(session.user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-600 mt-2">Days Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
