/**
 * Payment class demonstrating POLYMORPHISM
 * Base class for different payment methods
 */
class Payment {
  constructor(amount, userId, ticketId) {
    this.amount = amount;
    this.userId = userId;
    this.ticketId = ticketId;
    this.status = 'PENDING';
    this.transactionId = null;
    this.createdAt = new Date();
  }

  // Abstract method to be overridden by subclasses
  processPayment() {
    throw new Error('processPayment method must be implemented by subclass');
  }

  // Method to get payment status
  getStatus() {
    return this.status;
  }

  // Method to get transaction details
  getTransactionDetails() {
    return {
      amount: this.amount,
      userId: this.userId,
      ticketId: this.ticketId,
      status: this.status,
      transactionId: this.transactionId,
      createdAt: this.createdAt
    };
  }
}

/**
 * CardPayment class demonstrating POLYMORPHISM
 * Inherits from Payment and overrides processPayment method
 */
class CardPayment extends Payment {
  constructor(amount, userId, ticketId, cardNumber, expiryDate, cvv) {
    super(amount, userId, ticketId);
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
    this.paymentMethod = 'CARD';
  }

  // Override processPayment method (FAKE PAYMENT - Always succeeds)
  processPayment() {
    // Simulate card payment processing
    console.log(`Processing card payment of ₹${this.amount} for card ending in ${this.cardNumber ? this.cardNumber.slice(-4) : '****'}`);
    
    // FAKE PAYMENT - Always succeeds for demo purposes
    this.status = 'SUCCESS';
    this.transactionId = `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Card payment successful (FAKE)');
    return true;
  }

  // Method to validate card details
  validateCardDetails() {
    // Basic validation (in real app, this would be more comprehensive)
    return this.cardNumber && this.cardNumber.length >= 16 && 
           this.expiryDate && this.cvv && this.cvv.length === 3;
  }
}

/**
 * UpiPayment class demonstrating POLYMORPHISM
 * Inherits from Payment and overrides processPayment method
 */
class UpiPayment extends Payment {
  constructor(amount, userId, ticketId, upiId) {
    super(amount, userId, ticketId);
    this.upiId = upiId;
    this.paymentMethod = 'UPI';
  }

  // Override processPayment method (FAKE PAYMENT - Always succeeds)
  processPayment() {
    // Simulate UPI payment processing
    console.log(`Processing UPI payment of ₹${this.amount} for UPI ID: ${this.upiId || 'user@upi'}`);
    
    // FAKE PAYMENT - Always succeeds for demo purposes
    this.status = 'SUCCESS';
    this.transactionId = `UPI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('UPI payment successful (FAKE)');
    return true;
  }

  // Method to validate UPI ID
  validateUpiId() {
    // Basic UPI ID validation
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(this.upiId);
  }
}

/**
 * WalletPayment class demonstrating POLYMORPHISM
 * Inherits from Payment and overrides processPayment method
 */
class WalletPayment extends Payment {
  constructor(amount, userId, ticketId, walletType, walletNumber) {
    super(amount, userId, ticketId);
    this.walletType = walletType;
    this.walletNumber = walletNumber;
    this.paymentMethod = 'WALLET';
  }

  // Override processPayment method (FAKE PAYMENT - Always succeeds)
  processPayment() {
    // Simulate wallet payment processing
    console.log(`Processing ${this.walletType || 'PayTM'} wallet payment of ₹${this.amount} for wallet: ${this.walletNumber || '9876543210'}`);
    
    // FAKE PAYMENT - Always succeeds for demo purposes
    this.status = 'SUCCESS';
    this.transactionId = `WALLET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Wallet payment successful (FAKE)');
    return true;
  }

  // Method to validate wallet details
  validateWalletDetails() {
    // Basic wallet validation
    return this.walletType && this.walletNumber && this.walletNumber.length >= 10;
  }
}

export {
  Payment,
  CardPayment,
  UpiPayment,
  WalletPayment
};
