// auth.js - Authentication routes and middleware
const express = require('express');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById, validatePassword } = require('./user.js');

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePasswordFormat = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, email, and password are required' 
        });
      }
  
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
      }
  
      if (!validatePasswordFormat(password)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 6 characters long' 
        });
      }
  
      // Create user
      const user = await createUser({ name, email, password });
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
  
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
        token
      });
  
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  });
  
  // Login endpoint
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
      }
  
      // Find user
      const user = findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
  
      // Validate password (note: we're using the validatePassword from users.js here)
      const isValidPassword = await validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
  
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
  
      res.json({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  });


 // Protected route example - Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword
  });
});

module.exports = { 
  router, 
  authenticateToken // Export middleware for other routes
};