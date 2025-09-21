// users.js - Simple in-memory user storage (like your data.js approach)
const bcrypt = require('bcryptjs');

// In-memory user storage (in real app, this would be a database)
let users = [];

// Helper functions
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  return users.find(user => user.id === id);
};

const createUser = async (userData) => {
  const { name, email, password } = userData;
  
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User already exists');
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const newUser = {
    id: Date.now().toString(), // Simple ID generation
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  validatePassword,
  getAllUsers: () => users // For debugging only
};