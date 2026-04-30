'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, Sparkles, Shield, ArrowRight, CheckCircle, Users, Star, TrendingUp, Zap, Heart, Award, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();

  const features = [
    {
      icon: Shield,
      title: 'Smart Waitlist System',
      description: 'Join waitlists for sold-out events and get notified when tickets become available.'
    },
    {
      icon: Zap,
      title: 'Digital Tickets',
      description: 'Receive your tickets instantly with QR codes for easy entry at events.'
    },
    {
      icon: TrendingUp,
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees. See exactly what you pay for.'
    },
    {
      icon: Heart,
      title: 'Event Discovery',
      description: 'Browse and filter events by category, date, and location to find what interests you.'
    },
    {
      icon: Award,
      title: 'Secure Platform',
      description: 'Safe and secure booking process with protected payment information.'
    },
    {
      icon: Users,
      title: 'Easy Management',
      description: 'Manage your bookings, view ticket history, and track upcoming events in one place.'
    }
  ];


  const stats = [
    { number: '1000+', label: 'Tickets Available' },
    { number: '50+', label: 'Events Listed' },
    { number: '100%', label: 'Secure Booking' },
    { number: '24/7', label: 'System Uptime' }
  ];

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <section className="py-12 lg:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <div className="glass-card rounded-[4rem] p-12 mb-8 bg-gradient-to-br from-indigo-300/30 via-purple-300/30 to-pink-300/30">
              <div className="flex justify-center mb-6">
                <div className="glass-badge flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs font-semibold text-gray-800">Smart Event Ticketing</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                <span className="block mb-1">{session ? `Welcome back,` : 'Never Miss'}</span>
                <span className="gradient-text">{session ? `${session.user.name}!` : 'an Event Again'}</span>
              </h1>
              
              <p className="text-lg lg:text-xl mb-8 text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {session 
                  ? 'Continue your journey with amazing events and seamless ticket management'
                  : 'Experience the smartest way to book tickets. From concerts to conferences, get instant access to the events you love.'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                {!session ? (
                  <>
                    <Link href="/auth/signup" className="btn btn-primary text-base px-8 py-3 flex items-center justify-center space-x-2 font-semibold">
                      <span>Create Account</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link href="/auth/signin" className="btn btn-outline text-base px-8 py-3 font-semibold">
                      Sign In
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/events" className="btn btn-primary text-base px-8 py-3 flex items-center justify-center space-x-2 font-semibold">
                      <span>Discover Events</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link href="/my-tickets" className="btn btn-outline text-base px-8 py-3 font-semibold">
                      My Tickets
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="glass-badge flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-gray-700">Transparent Pricing</span>
                </div>
                <div className="glass-badge flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-gray-700">Digital Tickets</span>
                </div>
                <div className="glass-badge flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-gray-700">Easy Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Features Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-[4rem] p-12 bg-gradient-to-br from-white/40 via-purple-100/50 to-indigo-100/40">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="gradient-text">Why Choose SmartTicket?</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Discover the innovative features that make us the most trusted event ticketing platform in the industry
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <div key={index} className="glass-feature slide-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-5 w-20 h-20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}
