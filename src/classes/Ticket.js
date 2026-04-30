/**
 * Ticket class demonstrating ENCAPSULATION
 * Encapsulates ticket properties and behaviors
 */
class Ticket {
  constructor(id, userId, eventId, seatType, quantity, status, price) {
    this.id = id;
    this.userId = userId;
    this.eventId = eventId;
    this.seatType = seatType;
    this.quantity = quantity;
    this.status = status;
    this.price = price;
    this.qrCode = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getters for encapsulated properties
  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getEventId() {
    return this.eventId;
  }

  getSeatType() {
    return this.seatType;
  }

  getQuantity() {
    return this.quantity;
  }

  getStatus() {
    return this.status;
  }

  getPrice() {
    return this.price;
  }

  getQRCode() {
    return this.qrCode;
  }

  // Method to confirm booking
  confirmBooking() {
    this.status = 'BOOKED';
    this.updatedAt = new Date();
    this.generateQRCode();
  }

  // Method to add to waitlist
  addToWaitlist() {
    this.status = 'WAITLISTED';
    this.updatedAt = new Date();
  }

  // Method to cancel ticket
  cancel() {
    this.status = 'CANCELLED';
    this.updatedAt = new Date();
    this.qrCode = null; // Remove QR code on cancellation
  }

  // Method to generate QR code for confirmed tickets
  generateQRCode() {
    if (this.status === 'BOOKED') {
      // Generate QR code data (in real app, this would be a proper QR code)
      this.qrCode = `TICKET-${this.id}-${this.userId}-${this.eventId}`;
    }
  }

  // Method to check if ticket is active
  isActive() {
    return this.status === 'BOOKED';
  }

  // Method to check if ticket is waitlisted
  isWaitlisted() {
    return this.status === 'WAITLISTED';
  }

  // Method to check if ticket is cancelled
  isCancelled() {
    return this.status === 'CANCELLED';
  }

  // Method to get ticket details
  getDetails() {
    return {
      id: this.id,
      userId: this.userId,
      eventId: this.eventId,
      seatType: this.seatType,
      quantity: this.quantity,
      status: this.status,
      price: this.price,
      qrCode: this.qrCode,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Ticket;
