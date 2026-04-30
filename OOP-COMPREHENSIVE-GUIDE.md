# Smart Event Ticketing System - Comprehensive OOP Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [OOP Principles Implementation](#oop-principles-implementation)
3. [Class Architecture Deep Dive](#class-architecture-deep-dive)
4. [Design Patterns Used](#design-patterns-used)
5. [Business Logic Flow](#business-logic-flow)
6. [Code Examples and Best Practices](#code-examples-and-best-practices)
7. [Testing OOP Components](#testing-oop-components)
8. [Extending the System](#extending-the-system)

---

## System Overview

The Smart Event Ticketing System is a production-ready demonstration of Object-Oriented Programming principles in a real-world web application. This system showcases how OOP concepts translate into maintainable, scalable, and robust software architecture.

### Core Business Problem
- **Challenge**: Manage event ticketing with dynamic pricing, waitlist automation, and multiple payment methods
- **Solution**: Implement each business domain as a cohesive set of interacting objects
- **Result**: A system that's easy to understand, maintain, and extend

### OOP Design Philosophy
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed Principle**: Classes open for extension, closed for modification
- **Liskov Substitution**: Subtypes can replace base types without breaking functionality
- **Interface Segregation**: Clients don't depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

---

## OOP Principles Implementation

### 1. Encapsulation

#### Event Class - Perfect Encapsulation Example
```javascript
class Event {
  constructor(id, title, description, venue, date, capacity, basePrice, category) {
    // Private data (encapsulated)
    this.id = id;
    this.title = title;
    this.availableSeats = capacity;
    this.tickets = [];
    this.waitlist = [];
  }

  // Public interface (controlled access)
  getAvailableSeats() {
    return this.availableSeats;
  }

  // Business logic (encapsulated behavior)
  bookSeats(quantity) {
    if (this.hasAvailableSeats(quantity)) {
      this.availableSeats -= quantity;
      return true;
    }
    return false;
  }
}
```

**Benefits Demonstrated:**
- **Data Hiding**: Internal state protected from direct manipulation
- **Controlled Access**: Getters and setters provide validation
- **Behavior Bundling**: Related methods grouped with data
- **Maintainability**: Changes to internal logic don't affect external code

### 2. Inheritance

#### Payment Hierarchy - Inheritance in Action
```javascript
// Base class defines common interface
class Payment {
  constructor(amount, userId, ticketId) {
    this.amount = amount;
    this.userId = userId;
    this.ticketId = ticketId;
    this.status = 'PENDING';
  }

  // Abstract method - must be overridden
  processPayment() {
    throw new Error('processPayment method must be implemented by subclass');
  }

  // Common method shared by all subclasses
  getTransactionDetails() {
    return {
      amount: this.amount,
      userId: this.userId,
      status: this.status
    };
  }
}

// Subclass inherits and specializes
class CardPayment extends Payment {
  constructor(amount, userId, ticketId, cardNumber, expiryDate, cvv) {
    super(amount, userId, ticketId); // Call parent constructor
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
  }

  // Override parent method
  processPayment() {
    // Card-specific processing logic
    this.status = 'SUCCESS';
    this.transactionId = `CARD-${Date.now()}`;
    return true;
  }

  // Subclass-specific method
  validateCardDetails() {
    return this.cardNumber && this.cardNumber.length >= 16;
  }
}
```

**Benefits Demonstrated:**
- **Code Reuse**: Common properties and methods shared
- **Specialization**: Subclasses add specific behavior
- **Polymorphism**: Different types treated uniformly
- **Extensibility**: Easy to add new payment types

### 3. Polymorphism

#### Payment Processing - Polymorphic Behavior
```javascript
// Same interface, different implementations
class PaymentProcessor {
  static async processPayment(paymentMethod, amount, userId, ticketId, details) {
    let payment;

    // Factory method creates appropriate payment object
    switch (paymentMethod) {
      case 'CARD':
        payment = new CardPayment(amount, userId, ticketId, details.cardNumber, details.expiryDate, details.cvv);
        break;
      case 'UPI':
        payment = new UpiPayment(amount, userId, ticketId, details.upiId);
        break;
      case 'WALLET':
        payment = new WalletPayment(amount, userId, ticketId, details.walletType, details.walletNumber);
        break;
      default:
        throw new Error('Unsupported payment method');
    }

    // Polymorphic call - same method name, different behavior
    const success = payment.processPayment();
    
    if (success) {
      await this.updateTicketStatus(ticketId, 'BOOKED');
      await this.sendConfirmation(userId, ticketId);
    }

    return payment.getTransactionDetails();
  }
}
```

**Benefits Demonstrated:**
- **Interface Uniformity**: Same method name across different types
- **Runtime Flexibility**: Behavior determined at runtime
- **Extensibility**: New types added without changing existing code
- **Clean Code**: No if-else chains for different types

### 4. Abstraction

#### NotificationService - Abstraction in Practice
```javascript
class NotificationService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  // High-level abstracted interface
  async sendBookingConfirmation(userId, ticketId, eventName, eventDate) {
    // Complex operations hidden behind simple method
    const message = this.formatBookingMessage(eventName, eventDate, ticketId);
    const notification = await this.createNotification(userId, message, 'BOOKING_CONFIRMED');
    await this.deliverNotification(notification);
    return notification;
  }

  // Private implementation details hidden from users
  async createNotification(userId, message, type) {
    return await this.prisma.notification.create({
      data: {
        userId,
        message,
        type,
        status: 'UNREAD'
      }
    });
  }

  formatBookingMessage(eventName, eventDate, ticketId) {
    return `Your ticket for "${eventName}" on ${new Date(eventDate).toLocaleDateString()} has been confirmed! Ticket ID: ${ticketId}`;
  }

  async deliverNotification(notification) {
    // Could be email, SMS, push notification, etc.
    console.log(`[NOTIFICATION] Delivered: ${notification.message}`);
  }
}
```

**Benefits Demonstrated:**
- **Complexity Hiding**: Internal operations hidden from clients
- **Simple Interface**: Easy-to-use high-level methods
- **Implementation Flexibility**: Internal logic can change without affecting clients
- **Focus on What, Not How**: Clients focus on what they want, not how it's done

### 5. Composition

#### Event Class - Composition Over Inheritance
```javascript
class Event {
  constructor(eventData) {
    // Event composed of other objects
    this.id = eventData.id;
    this.title = eventData.title;
    
    // Composition: Event has Tickets
    this.tickets = [];
    
    // Composition: Event has Waitlist
    this.waitlist = [];
    
    // Composition: Event has PricingStrategy
    this.pricingStrategy = new DynamicPricingStrategy(eventData.basePrice);
  }

  // Delegation to composed objects
  calculatePrice(seatType, quantity) {
    return this.pricingStrategy.calculatePrice(this, seatType, quantity);
  }

  addTicket(ticket) {
    this.tickets.push(ticket);
    // Event manages its composed objects
    this.updateStatistics();
  }

  addToWaitlist(waitlistEntry) {
    this.waitlist.push(waitlistEntry);
    // Composition: Event manages waitlist behavior
    this.waitlist.sort((a, b) => a.user.getWaitlistPriority() - b.user.getWaitlistPriority());
  }
}
```

**Benefits Demonstrated:**
- **Flexibility**: Can change composed objects at runtime
- **Testability**: Each component can be tested independently
- **Maintainability**: Changes to one component don't affect others
- **Code Reuse**: Components can be reused in different contexts

---

## Class Architecture Deep Dive

### Core Domain Classes

#### 1. Event Class - The Central Hub
```javascript
/**
 * Event Class - Central domain object
 * 
 * Responsibilities:
 * - Manage seat availability
 * - Handle booking logic
 * - Maintain waitlist queue
 * - Calculate dynamic pricing
 * - Provide statistics
 */
class Event {
  // Properties
  id, title, description, venue, date, capacity, availableSeats, basePrice, category
  tickets[], waitlist[], pricingStrategy

  // Core Methods
  hasAvailableSeats(quantity)
  bookSeats(quantity)
  cancelBooking(quantity)
  calculateDynamicPrice(seatType)
  getStatistics()
  
  // Waitlist Management
  addToWaitlist(waitlistEntry)
  removeFromWaitlist(userId)
  getNextFromWaitlist()
  
  // Ticket Management
  addTicket(ticket)
  getTicketsByStatus(status)
}
```

#### 2. Payment Hierarchy - Strategy Pattern
```javascript
/**
 * Payment Base Class - Abstract payment processor
 */
class Payment {
  // Common Properties
  amount, userId, ticketId, status, transactionId, createdAt
  
  // Abstract Method
  processPayment()
  
  // Common Methods
  getStatus(), getTransactionDetails()
}

/**
 * Concrete Payment Implementations
 */
class CardPayment extends Payment {
  // Card-specific properties
  cardNumber, expiryDate, cvv
  
  // Card-specific methods
  processPayment(), validateCardDetails()
}

class UpiPayment extends Payment {
  // UPI-specific properties
  upiId
  
  // UPI-specific methods
  processPayment(), validateUpiId()
}

class WalletPayment extends Payment {
  // Wallet-specific properties
  walletType, walletNumber
  
  // Wallet-specific methods
  processPayment(), validateWalletDetails()
}
```

#### 3. NotificationService - Service Layer
```javascript
/**
 * NotificationService - Service layer pattern
 * 
 * Responsibilities:
 * - Abstract notification creation
 * - Message formatting
 * - Delivery coordination
 * - Status tracking
 */
class NotificationService {
  // Dependencies
  prisma, messageFormatter, deliveryService
  
  // Public Interface (Abstracted)
  sendBookingConfirmation()
  sendWaitlistPromotion()
  sendCancellationConfirmation()
  sendEventReminder()
  sendCustomNotification()
  
  // Private Implementation
  createNotification()
  formatMessage()
  deliverNotification()
}
```

### Supporting Classes

#### Database Models as Classes
```javascript
// User Model - Entity with behavior
class User {
  id, name, email, password, role, createdAt, updatedAt
  
  // Relationships
  tickets[], waitlist[], notifications[]
  
  // Business Methods
  getWaitlistPriority()
  canBookEvent(event)
  getActiveTickets()
}

// Ticket Model - Value object with behavior
class Ticket {
  id, userId, eventId, seatType, quantity, status, price, qrCode, createdAt, updatedAt
  
  // Relationships
  user, event
  
  // Business Methods
  generateQRCode()
  isValidForEvent(eventId)
  canBeCancelled()
}

// Waitlist Model - Entity with queue behavior
class Waitlist {
  id, eventId, userId, position, createdAt
  
  // Relationships
  event, user
  
  // Business Methods
  promoteToTicket()
  updatePosition()
}
```

---

## Design Patterns Used

### 1. Strategy Pattern - Payment Processing
```javascript
// Strategy Interface
class PaymentStrategy {
  processPayment(amount, details) {
    throw new Error('Must implement processPayment');
  }
}

// Concrete Strategies
class CreditCardStrategy extends PaymentStrategy {
  processPayment(amount, details) {
    // Credit card processing logic
  }
}

class UpiStrategy extends PaymentStrategy {
  processPayment(amount, details) {
    // UPI processing logic
  }
}

// Context Class
class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executePayment(amount, details) {
    return this.strategy.processPayment(amount, details);
  }
}
```

### 2. Observer Pattern - Event Notifications
```javascript
// Subject Interface
class EventSubject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers(event, data) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}

// Concrete Subject
class Event extends EventSubject {
  bookSeats(quantity) {
    // Booking logic
    this.notifyObservers('SEATS_BOOKED', { quantity, availableSeats: this.availableSeats });
  }
}

// Observer
class NotificationObserver {
  update(event, data) {
    if (event === 'SEATS_BOOKED') {
      this.sendBookingNotification(data);
    }
  }
}
```

### 3. Factory Pattern - Payment Creation
```javascript
class PaymentFactory {
  static createPayment(type, amount, userId, ticketId, details) {
    switch (type) {
      case 'CARD':
        return new CardPayment(amount, userId, ticketId, details.cardNumber, details.expiryDate, details.cvv);
      case 'UPI':
        return new UpiPayment(amount, userId, ticketId, details.upiId);
      case 'WALLET':
        return new WalletPayment(amount, userId, ticketId, details.walletType, details.walletNumber);
      default:
        throw new Error(`Unsupported payment type: ${type}`);
    }
  }
}
```

### 4. Singleton Pattern - Notification Service
```javascript
class NotificationService {
  static instance = null;

  static getInstance() {
    if (NotificationService.instance === null) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    if (NotificationService.instance !== null) {
      throw new Error("Cannot instantiate singleton directly");
    }
    this.prisma = new PrismaClient();
  }
}
```

---

## Business Logic Flow

### 1. Event Discovery Flow
```javascript
// Use Case: Browse Events
class EventDiscoveryService {
  async getFilteredEvents(filters) {
    // 1. Get base events from database
    const events = await this.prisma.event.findMany({
      where: this.buildFilterQuery(filters)
    });

    // 2. Transform into Event objects with behavior
    const eventObjects = events.map(eventData => new Event(eventData));

    // 3. Apply business logic
    return eventObjects.map(event => ({
      ...event,
      availableSeats: event.getAvailableSeats(),
      dynamicPrice: event.calculateDynamicPrice('NORMAL', 1),
      occupancyRate: event.getStatistics().occupancyRate
    }));
  }
}
```

### 2. Booking Process Flow
```javascript
// Use Case: Book Ticket
class BookingService {
  async bookTicket(userId, eventId, seatType, quantity, paymentDetails) {
    // 1. Load event with behavior
    const eventData = await this.prisma.event.findUnique({ where: { id: eventId } });
    const event = new Event(eventData);

    // 2. Check availability
    if (!event.hasAvailableSeats(quantity)) {
      // Add to waitlist
      return await this.addToWaitlist(userId, event, quantity);
    }

    // 3. Calculate price
    const price = event.calculateDynamicPrice(seatType, quantity);

    // 4. Process payment (polymorphism)
    const payment = PaymentFactory.createPayment(
      paymentDetails.method, 
      price, 
      userId, 
      null, 
      paymentDetails
    );
    
    const paymentSuccess = payment.processPayment();
    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }

    // 5. Create ticket
    const ticket = await this.createTicket(userId, eventId, seatType, quantity, price);

    // 6. Update event state
    event.bookSeats(quantity);
    await this.updateEventInDatabase(event);

    // 7. Send notification (abstraction)
    await NotificationService.getInstance().sendBookingConfirmation(
      userId, 
      ticket.id, 
      event.getTitle(), 
      event.date
    );

    return ticket;
  }
}
```

### 3. Waitlist Automation Flow
```javascript
// Use Case: Automatic Waitlist Promotion
class WaitlistService {
  async processWaitlistPromotion(eventId, cancelledSeats) {
    // 1. Load event
    const eventData = await this.prisma.event.findUnique({ where: { id: eventId } });
    const event = new Event(eventData);

    // 2. Get next users from waitlist
    for (let i = 0; i < cancelledSeats; i++) {
      const waitlistEntry = event.getNextFromWaitlist();
      if (!waitlistEntry) break;

      // 3. Create ticket for waitlisted user
      const ticket = await this.createTicketFromWaitlist(waitlistEntry);

      // 4. Send notification (abstraction)
      await NotificationService.getInstance().sendWaitlistPromotion(
        waitlistEntry.user.getId(),
        ticket.id,
        event.getTitle(),
        event.date
      );

      // 5. Remove from waitlist
      event.removeFromWaitlist(waitlistEntry.user.getId());
    }

    // 6. Update event state
    await this.updateEventInDatabase(event);
  }
}
```

---

## Code Examples and Best Practices

### 1. SOLID Principles in Practice

#### Single Responsibility Principle
```javascript
// BAD: Class doing too much
class BadEventService {
  async bookTicket() { /* booking logic */ }
  async sendEmail() { /* email logic */ }
  async processPayment() { /* payment logic */ }
  async generateQRCode() { /* QR logic */ }
}

// GOOD: Each class has one responsibility
class BookingService {
  async bookTicket() { /* only booking logic */ }
}

class NotificationService {
  async sendEmail() { /* only notification logic */ }
}

class PaymentService {
  async processPayment() { /* only payment logic */ }
}

class QRCodeService {
  async generateQRCode() { /* only QR logic */ }
}
```

#### Open/Closed Principle
```javascript
// BAD: Need to modify for new payment types
class BadPaymentProcessor {
  processPayment(type, details) {
    if (type === 'CARD') { /* card logic */ }
    else if (type === 'UPI') { /* UPI logic */ }
    // Need to add else if for new types
  }
}

// GOOD: Open for extension, closed for modification
class PaymentProcessor {
  processPayment(payment) {
    return payment.processPayment(); // Works with any payment type
  }
}

// New payment types can be added without modifying existing code
class CryptoPayment extends Payment {
  processPayment() { /* crypto logic */ }
}
```

### 2. Error Handling in OOP
```javascript
class EventBookingException extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'EventBookingException';
    this.code = code;
    this.details = details;
  }
}

class Event {
  bookSeats(quantity) {
    if (quantity <= 0) {
      throw new EventBookingException(
        'Invalid quantity',
        'INVALID_QUANTITY',
        { quantity, available: this.availableSeats }
      );
    }

    if (!this.hasAvailableSeats(quantity)) {
      throw new EventBookingException(
        'Insufficient seats available',
        'INSUFFICIENT_SEATS',
        { requested: quantity, available: this.availableSeats }
      );
    }

    this.availableSeats -= quantity;
    return true;
  }
}
```

### 3. Dependency Injection
```javascript
// BAD: Hard-coded dependencies
class BadNotificationService {
  constructor() {
    this.prisma = new PrismaClient(); // Hard-coded
    this.emailService = new EmailService(); // Hard-coded
  }
}

// GOOD: Dependencies injected
class NotificationService {
  constructor(databaseService, messageService) {
    this.databaseService = databaseService; // Injected
    this.messageService = messageService; // Injected
  }

  async sendNotification(userId, message) {
    const notification = await this.databaseService.createNotification(userId, message);
    await this.messageService.deliver(notification);
    return notification;
  }
}

// Usage with dependency injection
const notificationService = new NotificationService(
  new PrismaDatabaseService(),
  new EmailMessageService()
);
```

---

## Testing OOP Components

### 1. Unit Testing Event Class
```javascript
// test/Event.test.js
describe('Event Class', () => {
  let event;

  beforeEach(() => {
    event = new Event(
      'event-1',
      'Test Event',
      'Description',
      'Venue',
      new Date('2024-12-31'),
      100,
      50,
      'CONCERT'
    );
  });

  describe('seat management', () => {
    test('should book seats when available', () => {
      const result = event.bookSeats(10);
      expect(result).toBe(true);
      expect(event.getAvailableSeats()).toBe(90);
    });

    test('should reject booking when insufficient seats', () => {
      const result = event.bookSeats(150);
      expect(result).toBe(false);
      expect(event.getAvailableSeats()).toBe(100);
    });

    test('should handle cancellation correctly', () => {
      event.bookSeats(20);
      event.cancelBooking(10);
      expect(event.getAvailableSeats()).toBe(90);
    });
  });

  describe('dynamic pricing', () => {
    test('should calculate VIP pricing correctly', () => {
      const price = event.calculateDynamicPrice('VIP');
      expect(price).toBe(125); // 50 * 2.5
    });

    test('should apply availability multiplier', () => {
      // Simulate low availability
      event.availableSeats = 5; // 5% available
      const price = event.calculateDynamicPrice('NORMAL');
      expect(price).toBe(75); // 50 * 1.5 (low availability)
    });
  });
});
```

### 2. Testing Payment Polymorphism
```javascript
// test/Payment.test.js
describe('Payment Hierarchy', () => {
  describe('CardPayment', () => {
    test('should process card payment successfully', () => {
      const payment = new CardPayment(100, 'user-1', 'ticket-1', '1234567890123456', '12/25', '123');
      
      const result = payment.processPayment();
      
      expect(result).toBe(true);
      expect(payment.getStatus()).toBe('SUCCESS');
      expect(payment.getTransactionDetails().transactionId).toMatch(/^CARD-/);
    });

    test('should validate card details', () => {
      const payment = new CardPayment(100, 'user-1', 'ticket-1', '1234567890123456', '12/25', '123');
      expect(payment.validateCardDetails()).toBe(true);
    });
  });

  describe('UpiPayment', () => {
    test('should process UPI payment successfully', () => {
      const payment = new UpiPayment(100, 'user-1', 'ticket-1', 'user@upi');
      
      const result = payment.processPayment();
      
      expect(result).toBe(true);
      expect(payment.getStatus()).toBe('SUCCESS');
      expect(payment.getTransactionDetails().transactionId).toMatch(/^UPI-/);
    });
  });
});
```

### 3. Testing NotificationService Abstraction
```javascript
// test/NotificationService.test.js
describe('NotificationService', () => {
  let notificationService;
  let mockDatabaseService;
  let mockMessageService;

  beforeEach(() => {
    mockDatabaseService = {
      createNotification: jest.fn()
    };
    mockMessageService = {
      deliver: jest.fn()
    };
    
    notificationService = new NotificationService(mockDatabaseService, mockMessageService);
  });

  test('should send booking confirmation', async () => {
    const mockNotification = { id: 'notif-1', message: 'Test message' };
    mockDatabaseService.createNotification.mockResolvedValue(mockNotification);

    const result = await notificationService.sendBookingConfirmation(
      'user-1', 
      'ticket-1', 
      'Test Event', 
      new Date('2024-12-31')
    );

    expect(mockDatabaseService.createNotification).toHaveBeenCalledWith(
      'user-1',
      expect.stringContaining('Test Event'),
      'BOOKING_CONFIRMED'
    );
    expect(result).toBe(mockNotification);
  });
});
```

---

## Extending the System

### 1. Adding New Payment Type
```javascript
// 1. Create new payment class
class CryptoPayment extends Payment {
  constructor(amount, userId, ticketId, cryptoType, walletAddress) {
    super(amount, userId, ticketId);
    this.cryptoType = cryptoType;
    this.walletAddress = walletAddress;
    this.paymentMethod = 'CRYPTO';
  }

  processPayment() {
    // Crypto-specific processing
    console.log(`Processing ${this.cryptoType} payment of $${this.amount}`);
    
    this.status = 'SUCCESS';
    this.transactionId = `CRYPTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return true;
  }

  validateCryptoDetails() {
    return this.cryptoType && this.walletAddress && this.walletAddress.length >= 30;
  }
}

// 2. Update factory
class PaymentFactory {
  static createPayment(type, amount, userId, ticketId, details) {
    switch (type) {
      // ... existing cases
      case 'CRYPTO':
        return new CryptoPayment(amount, userId, ticketId, details.cryptoType, details.walletAddress);
      default:
        throw new Error(`Unsupported payment type: ${type}`);
    }
  }
}

// 3. Update UI (no changes to existing logic needed)
```

### 2. Adding New Notification Type
```javascript
// 1. Extend NotificationService
class NotificationService {
  // ... existing methods

  async sendSmsNotification(userId, message, type = 'BOOKING_CONFIRMED') {
    const notification = await this.createNotification(userId, message, type);
    
    // SMS-specific delivery
    await this.smsService.sendSms(userId, message);
    
    console.log(`[SMS NOTIFICATION] Sent to user ${userId}: ${message}`);
    return notification;
  }

  async sendPushNotification(userId, message, type = 'BOOKING_CONFIRMED') {
    const notification = await this.createNotification(userId, message, type);
    
    // Push notification specific delivery
    await this.pushService.sendPush(userId, message);
    
    console.log(`[PUSH NOTIFICATION] Sent to user ${userId}: ${message}`);
    return notification;
  }
}
```

### 3. Adding New Event Type
```javascript
// 1. Create specialized event class
class ConcertEvent extends Event {
  constructor(eventData) {
    super(eventData);
    this.artist = eventData.artist;
    this.genre = eventData.genre;
  }

  // Override pricing for concerts
  calculateDynamicPrice(seatType) {
    let price = super.calculateDynamicPrice(seatType);
    
    // Concert-specific pricing logic
    if (this.genre === 'ROCK') {
      price *= 1.2; // 20% premium for rock concerts
    }
    
    return price;
  }

  // Concert-specific method
  getArtistInfo() {
    return {
      name: this.artist,
      genre: this.genre
    };
  }
}

class SportsEvent extends Event {
  constructor(eventData) {
    super(eventData);
    this.teams = eventData.teams;
    this.sport = eventData.sport;
  }

  // Sports-specific pricing
  calculateDynamicPrice(seatType) {
    let price = super.calculateDynamicPrice(seatType);
    
    // Sports-specific pricing logic
    if (this.teams.includes('Local Team')) {
      price *= 1.1; // 10% premium for local team games
    }
    
    return price;
  }
}

// 2. Update factory
class EventFactory {
  static createEvent(eventData) {
    switch (eventData.category) {
      case 'CONCERT':
        return new ConcertEvent(eventData);
      case 'SPORTS':
        return new SportsEvent(eventData);
      default:
        return new Event(eventData);
    }
  }
}
```

---

## Conclusion

This comprehensive OOP implementation demonstrates how Object-Oriented Programming principles create maintainable, scalable, and robust software systems. The Smart Event Ticketing System showcases:

### Key Takeaways
1. **Encapsulation** protects data and provides controlled access
2. **Inheritance** enables code reuse and specialization
3. **Polymorphism** provides flexibility and extensibility
4. **Abstraction** simplifies complex operations
5. **Composition** creates flexible object relationships

### Real-World Benefits
- **Maintainability**: Changes to one class don't break others
- **Testability**: Each component can be tested independently
- **Extensibility**: New features added without modifying existing code
- **Readability**: Code organized around real-world concepts
- **Reusability**: Components reused in different contexts

### Best Practices Demonstrated
- SOLID principles applied consistently
- Design patterns used appropriately
- Error handling implemented properly
- Dependency injection for testability
- Comprehensive test coverage

This system serves as an excellent reference for implementing OOP principles in production applications, showing how theoretical concepts translate into practical, working code that solves real business problems.
