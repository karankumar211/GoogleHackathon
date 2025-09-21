import React, { useState, useEffect } from "react";
import { createTransaction, getMonthlySummary } from "../utils/api"; // Assuming you have a getTransactions function

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    type: "Expense",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch initial data (summary and transactions)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly summary
        const summaryRes = await getMonthlySummary();
        setSummary(summaryRes.data);

        // You'll need an endpoint to get all transactions
        // const transactionsRes = await getTransactions();
        // setTransactions(transactionsRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Could not load financial data.");
      }
    };
    fetchData();
  }, []);
  console.log(summary)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await createTransaction(formData);
      // Add new transaction to the top of the list
      setTransactions([data.transaction, ...transactions]);
      // Optionally, refresh the summary data
      const summaryRes = await getMonthlySummary();
      setSummary(summaryRes.data);

      // Reset form
      setFormData({
        amount: "",
        category: "Food",
        type: "Expense",
        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Tracker</h1>

      {/* Summary Section */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-green-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-800">
              Total Income
            </h3>
            <p className="text-2xl font-bold text-green-900">
              ₹
              {summary.data.monthlyBudget}
            </p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-800">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-red-900">
              ₹
              {summary.data.totalSpent}
            </p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-800">remaning money </h3>
            <p className="text-2xl font-bold text-blue-900">
              ₹
              {summary.data.remaining }
            </p>
          </div>
        </div>
      )}

      {/* Add Transaction Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="md:col-span-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md">
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Salary</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm md:col-span-5">{error}</p>
          )}
        </form>
      </div>

      {/* Transaction List */}
      {/* You would map over the `transactions` state here to display them */}
    </div>
  );
};

export default ExpenseTracker;
