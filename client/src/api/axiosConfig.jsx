import axios from 'axios';

// Create an Axios instance with a base URL for your backend
const api = axios.create({
    baseURL: '/api/v1', // This will be proxied to your backend server
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
  This is an interceptor that adds the authentication token to the header of every request.
  This way, we don't have to manually add the token to each authenticated request.
*/
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- AUTHENTICATION ---
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => api.post('/users/login',  credentials);
export const logoutUser = () => api.post('/users/logout'); // New logout endpoint

// --- TRANSACTIONS & BUDGET ---
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);
export const createTransactionFromSms = (smsData) => api.post('/transactions/sms', smsData);
export const getMonthlySummary = () => api.get('/transactions/summary');
// Note: You might need an endpoint to GET all transactions, e.g., api.get('/transactions')


// --- AI FINANCIAL COACH ---
export const askAI = (queryData) => api.post('/ai/ask', queryData);


// --- ALERTS ---
export const getUnreadAlerts = () => api.get('/alerts');
export const markAlertAsRead = (alertId) => api.patch(`/alerts/${alertId}/read`);


// --- SECURITY ---
export const verifyLoanLink = (urlData) => api.post('/verify/link', urlData);

export default api;
