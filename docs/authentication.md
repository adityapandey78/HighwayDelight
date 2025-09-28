# Authentication Feature

This commit adds the complete user authentication system including:
- JWT token generation and validation
- Password hashing with bcrypt
- Login and signup endpoints
- Authentication middleware
- Secure session management

## Files added:
- authController.ts - handles auth logic
- auth.ts middleware - validates JWT tokens
- User model with auth fields