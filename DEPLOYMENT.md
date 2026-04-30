# Deployment Guide

## Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/smart_ticketing?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Test Accounts

After seeding the database, you can use these test accounts:

### Admin Account
- Email: `admin@smartticket.com`
- Password: `admin123`
- Role: Admin

### VIP Account  
- Email: `vip@smartticket.com`
- Password: `vip123`
- Role: VIP (10% discount, waitlist priority)

### Regular Account
- Email: `user@smartticket.com`
- Password: `user123`
- Role: Regular

## Testing the Application

### 1. Test User Registration and Login
- Visit `/auth/signup` to create new account
- Test different user roles
- Verify login functionality

### 2. Test Event Browsing
- Browse events on home page
- Test search and filter functionality
- Check event details pages

### 3. Test Booking Flow
- Select an event and choose seat type
- Verify dynamic pricing based on availability
- Test different payment methods
- Check QR code generation

### 4. Test Waitlist Automation
- Book tickets for an event with limited seats
- Fill up the event completely
- Try to book additional tickets (should go to waitlist)
- Cancel a booking and verify waitlist promotion
- Check that notifications are sent

### 5. Test VIP Features
- Login as VIP user
- Verify 10% discount is applied
- Test waitlist priority (VIP users should be promoted first)

### 6. Test Admin Dashboard
- Login as admin
- Create new events
- Monitor bookings and revenue
- View analytics

## Production Deployment (Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` (production PostgreSQL)
   - `NEXTAUTH_URL` (your domain)
   - `NEXTAUTH_SECRET` (generate new secret)
3. Deploy

### 3. Production Database
- Use a managed PostgreSQL service (Railway, Supabase, etc.)
- Update `DATABASE_URL` in production
- Run migrations: `npx prisma migrate deploy`

## Key Features to Test

### OOP Concepts Implementation
1. **Inheritance**: User classes (Regular, VIP, Admin)
2. **Polymorphism**: Payment classes (Card, UPI, Wallet)
3. **Encapsulation**: All classes hide internal state
4. **Abstraction**: NotificationService provides simple interface
5. **Composition**: Event has Tickets and Waitlist

### Business Logic
1. **Dynamic Pricing**: Prices increase as availability decreases
2. **VIP Priority**: VIP users get discounts and waitlist priority
3. **Waitlist Automation**: Automatic promotion when seats available
4. **QR Code Generation**: For confirmed bookings
5. **Role-Based Access**: Different permissions for different roles

### Automation Testing
1. Book tickets until event is full
2. Add users to waitlist
3. Cancel a booking
4. Verify first waitlisted user is promoted
5. Check notification is sent
6. Verify QR code is generated

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Authentication Issues**
   - Check `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your domain
   - Clear browser cookies

3. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check Node.js version (18+ required)
   - Verify environment variables

4. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Check database migrations are applied
   - Verify Prisma client is generated

### Debug Mode
Add these lines to your code for debugging:
```javascript
// In API routes
console.log('Debug info:', { data });

// In components
console.log('Component state:', state);
```

## Performance Optimization

### Database Indexes
The Prisma schema includes proper indexes for:
- User email (unique)
- Event dates
- Ticket statuses
- Waitlist positions

### Frontend Optimization
- Images are optimized with Next.js Image component
- API responses are paginated where needed
- Client-side state management is efficient

### Security
- Passwords are hashed with bcrypt
- Input validation on all endpoints
- Role-based access control
- CSRF protection with NextAuth

## Monitoring

### Application Monitoring
- Use Vercel Analytics for performance
- Monitor database query performance
- Track user behavior and conversion rates

### Error Tracking
- Implement error logging
- Monitor API response times
- Track failed bookings and payments

This completes the Smart Event Ticketing System with all requested features and OOP concepts properly implemented!
