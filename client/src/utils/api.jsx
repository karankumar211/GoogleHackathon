import axios from "axios";

// Create a configured instance of axios
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Your backend server URL
});

// Interceptor to add the Auth Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- AUTHENTICATION ---
export const registerUser = (userData) => api.post("/users/register", userData);
export const loginUser = (credentials) => api.post("/users/login", credentials);

// --- LOGOUT ---
export const logoutUser = () => {
  localStorage.removeItem("token");
  // Optionally, you can also clear other user-related data here
  return Promise.resolve({ message: "Logged out" });
};

// --- USER PROFILE ---
export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (profileData) => {
  return api.put("/users/profile", profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// --- TRANSACTIONS & BUDGET ---
export const createTransaction = (transactionData) =>
  api.post("/transactions", transactionData);
export const createTransactionFromSms = (smsData) =>
  api.post("/transactions/sms", smsData);
export const getMonthlySummary = () => api.get("/transactions/summary");
// The getTransactions function has been removed as it does not exist in the backend.

// --- AI FINANCIAL COACH ---
export const askAI = (queryData) => api.post("/ai/ask", queryData);
export const getFinancialInsights = () => api.get("/ai/insights");

// --- ALERTS ---
export const getUnreadAlerts = () => api.get("/alerts");
export const markAlertAsRead = (alertId) =>
  api.patch(`/alerts/${alertId}/read`);

// --- SECURITY ---
export const verifyLoanLink = (urlData) => api.post("/verify/link", urlData);
