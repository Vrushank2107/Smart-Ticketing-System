'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Menu, X, User, Calendar, Settings, LogOut, ChevronDown, Ticket, Home, Shield, Search } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notification count
  useEffect(() => {
    if (session) {
      fetchNotificationCount();
      
      // Set up polling for real-time updates
      const interval = setInterval(fetchNotificationCount, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const notifications = await response.json();
        const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;
        setNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
  ];

  const authenticatedNavItems = [
    { href: '/events', label: 'Events', icon: Search },
    { href: '/my-tickets', label: 'My Tickets', icon: Ticket },
    { href: '/notifications', label: 'Notifications', icon: Bell, hasBadge: true },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
            <div className="relative">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <svg
                  className="h-10 w-10 transition-all duration-300 group-hover:rotate-6"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background circle with gradient */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#e0e7ff" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer circle background */}
                  <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.1"/>
                  <circle cx="20" cy="20" r="16" fill="url(#logoGradient)" opacity="0.2"/>
                  
                  {/* Ticket shape */}
                  <path
                    d="M8 12 L8 28 Q8 30 10 30 L30 30 Q32 30 32 28 L32 12 Q32 10 30 10 L10 10 Q8 10 8 12 Z"
                    fill="url(#ticketGradient)"
                    stroke="url(#logoGradient)"
                    strokeWidth="1.5"
                  />
                  
                  {/* Ticket stub notch */}
                  <path
                    d="M32 16 Q34 16 34 18 Q34 20 32 20"
                    fill="url(#ticketGradient)"
                    stroke="url(#logoGradient)"
                    strokeWidth="1.5"
                  />
                  
                  {/* Smart chip/electronic element */}
                  <rect x="12" y="14" width="6" height="6" rx="1" fill="url(#logoGradient)" opacity="0.8"/>
                  <circle cx="15" cy="17" r="1" fill="white"/>
                  
                  {/* QR code dots */}
                  <rect x="20" y="14" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="22.5" y="14" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="25" y="14" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="20" y="16.5" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="25" y="16.5" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="20" y="19" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="22.5" y="19" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  <rect x="25" y="19" width="1.5" height="1.5" fill="url(#logoGradient)" opacity="0.6"/>
                  
                  {/* Bottom text line */}
                  <rect x="12" y="24" width="16" height="1" fill="url(#logoGradient)" opacity="0.4"/>
                  <rect x="12" y="26" width="10" height="1" fill="url(#logoGradient)" opacity="0.3"/>
                </svg>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-lg group-hover:from-indigo-400/30 group-hover:to-purple-400/30 transition-all duration-300"></div>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
              SmartTicket
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <item.icon className={`h-4 w-4 transition-transform ${
                  isActive(item.href) ? 'text-indigo-700' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            {session && authenticatedNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <item.icon className={`h-4 w-4 transition-transform ${
                  isActive(item.href) ? 'text-indigo-700' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{item.label}</span>
                {item.hasBadge && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            ))}
            {session?.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  isActive('/admin')
                    ? 'bg-purple-100 text-purple-700 font-semibold'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Shield className={`h-4 w-4 transition-transform ${
                  isActive('/admin') ? 'text-purple-700' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">Admin</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse flex space-x-3">
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            ) : session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <User className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </span>
                      {session.user.role === 'ADMIN' && (
                        <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-medium">
                          {session.user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  isUserMenuOpen 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-2 invisible'
                }`}>
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-primary-50">
                    <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <span className="font-medium">Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-indigo-700' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              {session && authenticatedNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-indigo-700' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.hasBadge && notificationCount > 0 && (
                    <span className="absolute top-2 right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>
              ))}
              {session?.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive('/admin')
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className={`h-5 w-5 ${isActive('/admin') ? 'text-purple-700' : ''}`} />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              )}
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                {session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                        {session.user.role === 'ADMIN' && (
                          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-medium">
                            {session.user.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-4">
                    <Link
                      href="/auth/signin"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
