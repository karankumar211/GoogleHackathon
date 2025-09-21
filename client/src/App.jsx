import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ExpenseTracker from "./pages/ExpenseTracker";
import AIInsights from "./pages/AIInsights";
import ChatPage from "./pages/ChatPage";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyLink from "./pages/VerifyLink";

// A helper component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// A layout for pages that should have the sidebar and navbar
const MainLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes wrapped in the MainLayout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <MainLayout>
                <ExpenseTracker />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-insights"
          element={
            <PrivateRoute>
              <MainLayout>
                <AIInsights />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <MainLayout>
                <ChatPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/verify-link"
          element={
            <PrivateRoute>
              <MainLayout>
                <VerifyLink />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Redirect any other path to the dashboard if logged in, or landing page if not */}
        <Route
          path="*"
          element={
            <Navigate to={localStorage.getItem("token") ? "/dashboard" : "/"} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
