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

  // Method to check if user is VIP (removed - only Admin and Regular users)
  isVIP() {
    return false; // No VIP users in simplified system
  }

  // Method to check if user is Admin
  isAdmin() {
    return this.role === 'ADMIN';
  }

  // Method to get user priority for waitlist (simplified)
  getWaitlistPriority() {
    switch (this.role) {
      case 'ADMIN':
        return 1; // Admin priority
      case 'REGULAR':
        return 2; // Regular user priority
      default:
        return 2;
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

export {
  User,
  RegularUser,
  AdminUser
};
