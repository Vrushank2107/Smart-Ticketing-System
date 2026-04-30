# Smart Event Ticketing System

A comprehensive Object-Oriented Programming (OOP) demonstration project implementing a full-stack event ticketing system with capacity management and waitlist automation. Built with Next.js, Prisma, and PostgreSQL, this system showcases real-world OOP principles in action.

## How the Website Works: An OOP Perspective

### System Architecture Overview

The Smart Event Ticketing System is designed using core Object-Oriented Programming principles to create a maintainable, scalable, and robust application. Each major component of the system is implemented as a class with specific responsibilities, following SOLID principles.

### Core OOP Classes and Their Roles

#### 1. Event Class (`src/classes/Event.js`)
**Demonstrates: ENCAPSULATION and COMPOSITION**

The `Event` class is the cornerstone of our system, encapsulating all event-related data and behaviors:

```javascript
class Event {
  constructor(id, title, description, venue, date, capacity, basePrice, category) {
    // Encapsulated properties
    this.id = id;
    this.title = title;
    this.availableSeats = capacity;
    this.tickets = []; // Composition: Event has Tickets
    this.waitlist = []; // Composition: Event has Waitlist
  }
}
```

**Key OOP Features:**
- **Encapsulation**: Private properties accessed through getter methods
- **Composition**: Event contains Ticket and Waitlist objects
- **Business Logic Methods**: `bookSeats()`, `cancelBooking()`, `calculateDynamicPrice()`
- **Statistics Method**: `getStatistics()` provides event analytics

**Real-World Application:**
- Manages seat availability with thread-safe operations
- Implements dynamic pricing based on availability ratios
- Handles waitlist queue with VIP priority sorting

#### 2. Payment Hierarchy (`src/classes/Payment.js`)
**Demonstrates: POLYMORPHISM and INHERITANCE**

The payment system uses polymorphism to handle multiple payment methods seamlessly:

```javascript
// Base class with abstract method
class Payment {
  processPayment() {
    throw new Error('processPayment method must be implemented by subclass');
  }
}

// Polymorphic implementations
class CardPayment extends Payment {
  processPayment() { /* Card-specific logic */ }
}

class UpiPayment extends Payment {
  processPayment() { /* UPI-specific logic */ }
}

class WalletPayment extends Payment {
  processPayment() { /* Wallet-specific logic */ }
}
```

**Key OOP Features:**
- **Polymorphism**: Same interface, different implementations
- **Inheritance**: Common properties and methods inherited from base class
- **Abstraction**: Complex payment processing hidden behind simple interface
- **Method Overriding**: Each payment type customizes the processing logic

**Real-World Application:**
- Payment processing is unified across different methods
- Easy to extend with new payment types
- Validation logic specific to each payment method

#### 3. NotificationService Class (`src/classes/NotificationService.js`)
**Demonstrates: ABSTRACTION and SINGLE RESPONSIBILITY**

The NotificationService abstracts the complexity of notification management:

```javascript
class NotificationService {
  // Abstracted complex operations
  async sendBookingConfirmation(userId, ticketId, eventName, eventDate) {
    const message = `Your ticket for "${eventName}"...`;
    return await this.createNotification(userId, message, 'BOOKING_CONFIRMED');
  }
}
```

**Key OOP Features:**
- **Abstraction**: Hides database operations and message formatting
- **Single Responsibility**: Only handles notification-related operations
- **Encapsulation**: Private methods for internal notification creation
- **Interface Segregation**: Different methods for different notification types

**Real-World Application:**
- Centralized notification management
- Database operations abstracted away from business logic
- Easy to extend with new notification types

### Database Integration with OOP

The system uses Prisma ORM to map database models to OOP concepts:

#### Database Models as Classes
- **User Model**: User entity with role-based relationships
- **Event Model**: Event entity with ticket and waitlist relationships
- **Ticket Model**: Booking entity with status tracking
- **Waitlist Model**: Queue management for sold-out events
- **Notification Model**: Message delivery system

#### Relationships Demonstrate OOP Concepts
- **Composition**: Event has many Tickets and Waitlist entries
- **Association**: User has many Tickets and Notifications
- **Aggregation**: Event aggregates booking statistics

### Business Flow: OOP in Action

#### 1. Event Discovery Flow
```javascript
// Event class provides search capabilities
Event.getFilteredEvents(filters) // Returns filtered event list
Event.getStatistics() // Provides analytics for admin dashboard
```

#### 2. Booking Process Flow
```javascript
// Event manages its own state
const event = new Event(eventData);
if (event.hasAvailableSeats(quantity)) {
  event.bookSeats(quantity); // Event updates its state
  // Payment polymorphism in action
  const payment = createPayment(method, amount, userId, ticketId);
  payment.processPayment(); // Polymorphic call
} else {
  event.addToWaitlist(waitlistEntry); // Event manages waitlist
}
```

#### 3. Waitlist Automation Flow
```javascript
// Event manages its waitlist automatically
const nextUser = event.getNextFromWaitlist();
if (nextUser) {
  // Notification service abstraction
  await notificationService.sendWaitlistPromotion(
    nextUser.userId, ticketId, event.title, event.date
  );
}
```

### Key Features Enhanced by OOP

#### Smart Booking System
- **Event Class**: Manages seat availability and booking logic
- **Payment Classes**: Handle different payment methods polymorphically
- **NotificationService**: Sends confirmations automatically

#### Waitlist Automation
- **Event Class**: Maintains waitlist queue with priority ordering
- **NotificationService**: Abstracts notification complexity
- **Composition**: Event contains and manages waitlist objects

#### Dynamic Pricing
- **Event Class**: Calculates prices based on availability and seat type
- **Encapsulation**: Pricing logic hidden behind simple method calls
- **Business Rules**: Complex pricing algorithms encapsulated in methods

#### Role-Based Access Control
- **User Hierarchy**: Different user types with specific behaviors
- **Inheritance**: Common user properties, specialized methods
- **Polymorphism**: Different user behaviors through same interface

## Features

### Core Functionality
- **Smart Booking System**: Automatic booking if seats available, waitlist if full
- **Waitlist Automation**: Automatic promotion when seats become available
- **Dynamic Pricing**: Prices increase based on availability
- **QR Code Tickets**: Generated QR codes for confirmed bookings
- **Role-Based Access**: Regular and Admin roles

### User Features
- Browse events with search and filters
- Book tickets with multiple payment methods
- View booking history and QR codes
- Receive notifications for booking confirmations and waitlist promotions
- Cancel bookings with automatic waitlist promotion

### Admin Features
- Create and manage events
- Monitor bookings and revenue
- View analytics dashboard
- Manage waitlist

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Other**: QRCode generation, bcrypt for password hashing

## Object-Oriented Programming Implementation

### Encapsulation
- `Event` class encapsulates event properties and behaviors with private getters
- `Payment` classes encapsulate payment processing logic
- `NotificationService` encapsulates database operations

### Inheritance
- `CardPayment`, `UpiPayment`, `WalletPayment` extend base `Payment` class
- Each subclass inherits common properties and overrides specific methods

### Polymorphism
- `Payment` hierarchy allows different payment methods through same interface
- `processPayment()` method behaves differently based on object type

### Abstraction
- `NotificationService` abstracts notification complexity
- `Event` class abstracts seat management and pricing logic

### Composition
- `Event` contains `Tickets` and `Waitlist` objects
- Complex relationships between objects demonstrate composition patterns

## Project Structure

```
src/
app/                    # Next.js App Router pages
  api/               # API routes
  auth/              # Authentication pages
  events/            # Event details pages
  admin/             # Admin dashboard
  my-tickets/        # User tickets page
  notifications/     # Notifications page
  profile/           # User profile pages
  settings/          # Settings pages
  layout.js          # Root layout
  page.js            # Home page
  globals.css        # Global styles
components/            # Reusable React components
classes/              # OOP classes
  User.js           # User hierarchy
  Event.js          # Event management
  Ticket.js         # Ticket handling
  Payment.js        # Payment processing
  NotificationService.js # Notifications
lib/                 # Utility libraries
```

## Installation and Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Git for version control

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create `.env.local` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/smart_ticketing?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NODE_ENV="development"
```

### Step 3: Database Setup
```bash
# Option 1: Use the reset script (recommended)
node reset-database.js

# Option 2: Use Prisma commands
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Test Accounts
After running the reset script, use these accounts:

#### Admin Account
- Email: `admin@smartticket.com`
- Password: `admin123`
- Role: Admin (can create/manage events)

#### VIP Account  
- Email: `vip@smartticket.com`
- Password: `vip123`
- Role: VIP (10% discount, waitlist priority)

#### Regular Account
- Email: `user@smartticket.com`
- Password: `user123`
- Role: Regular

### Testing Flow

#### 1. Test Event Browsing
- Go to `http://localhost:3000`
- You should see 8 upcoming events
- Test search and filter functionality
- Click on any event to see details

#### 2. Test Booking Flow (Regular User)
1. Login as `user@smartticket.com`
2. Go to any event (e.g., "Comedy Night Special" - only 50 seats)
3. Select seat type and quantity
4. Choose payment method
5. Complete booking
6. Check "My Tickets" - you should see the booked ticket with QR code

#### 3. Test Waitlist Flow
1. Login as `vip@smartticket.com`
2. Go to "Web Development Workshop" (only 15 seats available)
3. Try to book more tickets than available
4. You should be added to waitlist
5. Check "My Tickets" - you'll see waitlisted ticket

#### 4. Test Waitlist Automation
1. Login as `user@smartticket.com`
2. Cancel the booked ticket
3. Check VIP user's tickets - should be promoted from waitlist to booked
4. Check notifications - VIP user should get promotion notification

#### 5. Test Admin Features
1. Login as `admin@smartticket.com`
2. Go to `/admin`
3. Create a new event
4. View analytics and event management
5. Test event deletion (only events without bookings)

#### 6. Test VIP Benefits
1. Login as VIP user
2. Try booking - should see 10% discount applied
3. Check waitlist priority - VIP users get promoted first

### Troubleshooting

#### If events don't show:
1. Check database connection in `.env.local`
2. Run `node reset-database.js` to reseed
3. Check browser console for errors

#### If login doesn't work:
1. Verify `NEXTAUTH_SECRET` is set
2. Check database has users
3. Clear browser cookies

#### If booking fails:
1. Check if event has available seats
2. Verify payment processing logic
3. Check API responses in browser dev tools

#### If admin can't create events:
1. Verify user role is ADMIN
2. Check authentication session
3. Look for console errors

### Key Features to Verify

#### OOP Concepts:
- **Inheritance**: Different user types (Regular, VIP, Admin)
- **Polymorphism**: Payment methods (Card, UPI, Wallet)
- **Encapsulation**: All classes hide internal state
- **Abstraction**: NotificationService provides simple interface
- **Composition**: Event has Tickets and Waitlist

#### Business Logic:
- **Dynamic Pricing**: Prices increase as availability decreases
- **VIP Priority**: VIP users get discounts and waitlist priority  
- **Waitlist Automation**: Automatic promotion when seats available
- **QR Code Generation**: For confirmed bookings
- **Role-Based Access**: Different permissions for different roles

#### Automation Testing:
1. Book tickets until event is full
2. Add users to waitlist
3. Cancel a booking
4. Verify first waitlisted user is promoted
5. Check notification is sent
6. Verify QR code is generated

### Expected Results

After proper setup, you should see:
- 8 upcoming events on home page
- Working authentication for all user types
- Successful booking with QR codes
- Waitlist automation working
- Admin dashboard functional
- VIP discounts and priority working

The application demonstrates real-world automation and strong OOP programming concepts as requested!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Events
- `GET /api/events` - Get all events (with search/filter)
- `POST /api/events` - Create new event (Admin only)
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event (Admin only)
- `DELETE /api/events/[id]` - Delete event (Admin only)

### Tickets
- `POST /api/tickets/book` - Book a ticket
- `POST /api/tickets/cancel` - Cancel a ticket
- `GET /api/tickets/my-tickets` - Get user tickets

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Mark notification as read

## Key Business Logic

### Booking Process
1. User selects event, seat type, and quantity
2. System checks availability
3. If available → Direct booking with payment
4. If full → Add to waitlist
5. Generate QR code for confirmed tickets

### Waitlist Automation
1. When any user cancels, vacancy is detected
2. First waitlisted user is automatically promoted
3. VIP users get priority in waitlist queue
4. Notification sent to promoted user
5. QR code generated for new booking

### Dynamic Pricing
- Base price multiplied by seat type factor (VIP: 2.5x, Premium: 1.5x, Normal: 1x)
- Additional multiplier based on availability:
  - < 10% available: +50%
  - < 20% available: +30%
  - < 50% available: +10%

### User Benefits
- Dynamic pricing based on seat type and availability
- Automatic waitlist management
- Digital QR code tickets
- Real-time notifications

## Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
- `DATABASE_URL` - Production PostgreSQL connection string
- `NEXTAUTH_URL` - Production domain URL
- `NEXTAUTH_SECRET` - Secure secret for NextAuth

## Testing

The application includes comprehensive business logic testing. See the "Testing Flow" section above for detailed step-by-step instructions.

```bash
# Run development server
npm run dev

# Test booking flow
# 1. Register as regular user
# 2. Book tickets for an event
# 3. Cancel booking to trigger waitlist promotion
# 4. Test admin features with admin account
```

### Key Testing Scenarios
- **Event Browsing**: View and filter 8 upcoming events
- **Booking Flow**: Complete ticket purchase with QR code generation
- **Waitlist System**: Automatic promotion when seats become available
- **Admin Dashboard**: Create and manage events
- **Notifications**: Real-time updates for booking changes

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper OOP principles
4. Test thoroughly
5. Submit pull request

## License

This project is for educational purposes to demonstrate OOP concepts in JavaScript and full-stack development.

## Support

For questions about the OOP implementation or business logic, refer to the code comments which explain:
- Where inheritance is used (User classes - RegularUser, AdminUser)
- Where polymorphism is used (Payment classes - CardPayment, UpiPayment, WalletPayment)
- Where abstraction is used (NotificationService)
- Where encapsulation is used (All classes)
- Where composition is used (Event class)

## Current Status

This is a fully functional ticketing system with:
- **8 sample events** pre-seeded in the database
- **Working authentication** with role-based access
- **Complete booking flow** with QR code generation
- **Automated waitlist system** with real-time notifications
- **Admin dashboard** for event management
- **Responsive UI** built with Tailwind CSS

The application demonstrates real-world automation and strong OOP programming concepts in a production-ready environment.
