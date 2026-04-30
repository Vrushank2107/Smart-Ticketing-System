# Smart Event Ticketing System

A full-stack web application with capacity management and waitlist automation, built with Next.js, Prisma, and PostgreSQL.

## Features

### Core Functionality
- **Smart Booking System**: Automatic booking if seats available, waitlist if full
- **Waitlist Automation**: Automatic promotion when seats become available
- **VIP Priority**: VIP users get priority in waitlist and discounts
- **Dynamic Pricing**: Prices increase based on availability
- **QR Code Tickets**: Generated QR codes for confirmed bookings
- **Role-Based Access**: Regular, VIP, and Admin roles

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
- `User` class encapsulates user properties and behaviors
- `Event` class encapsulates event data and methods
- `Ticket` class encapsulates ticket information

### Inheritance
- `RegularUser`, `VIPUser`, `AdminUser` extend base `User` class
- Each subclass overrides methods like `getDiscount()`

### Polymorphism
- `Payment` base class with `CardPayment`, `UpiPayment`, `WalletPayment` subclasses
- Each payment method overrides `processPayment()` method

### Abstraction
- `NotificationService` abstracts notification complexity
- Provides simple interface for different notification types

### Composition
- `Event` has `Tickets` and `Waitlist`
- Complex relationships between objects

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── events/            # Event details pages
│   ├── admin/             # Admin dashboard
│   ├── my-tickets/        # User tickets page
│   ├── notifications/     # Notifications page
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── classes/              # OOP classes
│   ├── User.js           # User hierarchy
│   ├── Event.js          # Event management
│   ├── Ticket.js         # Ticket handling
│   ├── Payment.js        # Payment processing
│   └── NotificationService.js # Notifications
├── services/             # Business logic services
├── lib/                 # Utility libraries
└── utils/               # Helper functions
```

## Installation and Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Git for version control

### 1. Clone and Install Dependencies

```bash
cd smart-ticketing-system
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smart_ticketing?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# For development
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

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

### VIP Benefits
- 10% discount on all bookings
- Priority in waitlist queue
- Reserved quota (5 seats per event)

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

The application includes comprehensive business logic testing:

```bash
# Run development server
npm run dev

# Test booking flow
# 1. Register as regular user
# 2. Book tickets for an event
# 3. Cancel booking to trigger waitlist promotion
# 4. Register as VIP user and test priority features
```

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
- Where inheritance is used (User classes)
- Where polymorphism is used (Payment classes)
- Where abstraction is used (NotificationService)
- Where encapsulation is used (All classes)
- Where composition is used (Event class)
