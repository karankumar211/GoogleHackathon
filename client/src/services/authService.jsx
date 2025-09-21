import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://localhost:8080/api/v1/users/';

/**
 * Logs a user in by sending their credentials to the backend.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {string} The access token.
 */
const login = async (email, password) => {
  const response = await axios.post(API_URL + 'login', {
    email,
    password,
  });

  // Check if the response contains the accessToken
  if (response.data && response.data.accessToken) {
    // Store the token in localStorage for session persistence
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
  } else {
    throw new Error('Login successful, but no token was provided by the API.');
  }
};

/**
 * Registers a new user.
 * @param {object} userData - An object containing username, email, password, and monthlyBudget.
 * @returns {object} The newly created user data.
 */
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  return response.data;
};

/**
 * Logs the user out by removing the token from localStorage.
 */
const logout = () => {
  localStorage.removeItem('accessToken');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;