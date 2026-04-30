/**
 * Event class demonstrating ENCAPSULATION and COMPOSITION
 * Encapsulates event properties and behaviors
 * Contains Tickets and Waitlist as composition
 */
class Event {
  constructor(id, title, description, venue, date, capacity, basePrice, category) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.venue = venue;
    this.date = date;
    this.capacity = capacity;
    this.availableSeats = capacity;
    this.basePrice = basePrice;
    this.category = category;
    this.tickets = []; // Composition: Event has Tickets
    this.waitlist = []; // Composition: Event has Waitlist
  }

  // Getters for encapsulated properties
  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getAvailableSeats() {
    return this.availableSeats;
  }

  getCapacity() {
    return this.capacity;
  }

  getBasePrice() {
    return this.basePrice;
  }

  // Method to check if event has available seats
  hasAvailableSeats(quantity = 1) {
    return this.availableSeats >= quantity;
  }

  // Method to book seats (reduces available seats)
  bookSeats(quantity) {
    if (this.hasAvailableSeats(quantity)) {
      this.availableSeats -= quantity;
      return true;
    }
    return false;
  }

  // Method to cancel booking (increases available seats)
  cancelBooking(quantity) {
    this.availableSeats += quantity;
    // Ensure available seats don't exceed capacity
    if (this.availableSeats > this.capacity) {
      this.availableSeats = this.capacity;
    }
  }

  // Method to add ticket to event
  addTicket(ticket) {
    this.tickets.push(ticket);
  }

  // Method to add user to waitlist
  addToWaitlist(waitlistEntry) {
    this.waitlist.push(waitlistEntry);
    // Sort waitlist by user priority (VIP first)
    this.waitlist.sort((a, b) => a.user.getWaitlistPriority() - b.user.getWaitlistPriority());
  }

  // Method to remove from waitlist
  removeFromWaitlist(userId) {
    this.waitlist = this.waitlist.filter(entry => entry.user.getId() !== userId);
  }

  // Method to get next user from waitlist
  getNextFromWaitlist() {
    return this.waitlist.length > 0 ? this.waitlist.shift() : null;
  }

  // Method to calculate dynamic pricing
  calculateDynamicPrice(seatType) {
    let price = this.basePrice;

    // Apply seat type multiplier
    switch (seatType) {
      case 'VIP':
        price *= 2.5;
        break;
      case 'PREMIUM':
        price *= 1.5;
        break;
      case 'NORMAL':
      default:
        price *= 1.0;
        break;
    }

    // Dynamic pricing based on availability
    const availabilityRatio = this.availableSeats / this.capacity;
    if (availabilityRatio < 0.1) {
      price *= 1.5; // 50% increase if less than 10% seats available
    } else if (availabilityRatio < 0.2) {
      price *= 1.3; // 30% increase if less than 20% seats available
    } else if (availabilityRatio < 0.5) {
      price *= 1.1; // 10% increase if less than 50% seats available
    }

    return Math.round(price * 100) / 100; // Round to 2 decimal places
  }

  // Method to get event statistics
  getStatistics() {
    const bookedTickets = this.tickets.filter(ticket => ticket.getStatus() === 'BOOKED');
    const waitlistedTickets = this.tickets.filter(ticket => ticket.getStatus() === 'WAITLISTED');
    const cancelledTickets = this.tickets.filter(ticket => ticket.getStatus() === 'CANCELLED');

    return {
      totalBookings: bookedTickets.length,
      totalWaitlist: this.waitlist.length,
      totalRevenue: bookedTickets.reduce((sum, ticket) => sum + ticket.getPrice(), 0),
      occupancyRate: ((this.capacity - this.availableSeats) / this.capacity) * 100
    };
  }
}

module.exports = Event;
