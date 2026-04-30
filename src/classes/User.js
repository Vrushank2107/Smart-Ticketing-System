/**
 * Base User class demonstrating ENCAPSULATION
 * Encapsulates user properties and behaviors
 */
class User {
  constructor(id, name, email, role = 'REGULAR') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  // Getters for encapsulated properties
  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getRole() {
    return this.role;
  }

  // Method to check if user is VIP
  isVIP() {
    return this.role === 'VIP';
  }

  // Method to check if user is Admin
  isAdmin() {
    return this.role === 'ADMIN';
  }

  // Method to get user priority for waitlist
  getWaitlistPriority() {
    switch (this.role) {
      case 'VIP':
        return 1; // Highest priority
      case 'ADMIN':
        return 2; // Second priority
      case 'REGULAR':
        return 3; // Lowest priority
      default:
        return 3;
    }
  }

  // Abstract method for getting discount (to be overridden by subclasses)
  getDiscount() {
    return 0;
  }
}

/**
 * RegularUser class demonstrating INHERITANCE
 * Inherits from User base class
 */
class RegularUser extends User {
  constructor(id, name, email) {
    super(id, name, email, 'REGULAR');
  }

  // Override getDiscount method
  getDiscount() {
    return 0; // No discount for regular users
  }
}

/**
 * VIPUser class demonstrating INHERITANCE
 * Inherits from User base class with special privileges
 */
class VIPUser extends User {
  constructor(id, name, email) {
    super(id, name, email, 'VIP');
  }

  // Override getDiscount method
  getDiscount() {
    return 0.1; // 10% discount for VIP users
  }

  // VIP users get reserved quota
  getReservedQuota() {
    return 5; // 5 seats reserved per event for VIP users
  }
}

/**
 * AdminUser class demonstrating INHERITANCE
 * Inherits from User base class with admin privileges
 */
class AdminUser extends User {
  constructor(id, name, email) {
    super(id, name, email, 'ADMIN');
  }

  // Override getDiscount method
  getDiscount() {
    return 0.2; // 20% discount for admin users
  }

  // Admin can override booking limits
  canOverrideLimits() {
    return true;
  }
}

module.exports = {
  User,
  RegularUser,
  VIPUser,
  AdminUser
};
