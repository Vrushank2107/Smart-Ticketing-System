'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Bell, Menu, X, User, Calendar, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">SmartTicket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Events
            </Link>
            {session && (
              <>
                <Link href="/my-tickets" className="text-gray-700 hover:text-primary-600 transition-colors">
                  My Tickets
                </Link>
                <Link href="/notifications" className="text-gray-700 hover:text-primary-600 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                    {session.user.role}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Events
              </Link>
              {session && (
                <>
                  <Link href="/my-tickets" className="text-gray-700 hover:text-primary-600 transition-colors">
                    My Tickets
                  </Link>
                  <Link href="/notifications" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Notifications
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}
              
              <div className="pt-3 border-t border-gray-200">
                {session ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {session.user.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                        {session.user.role}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/auth/signin" className="btn btn-secondary text-center">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="btn btn-primary text-center">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
