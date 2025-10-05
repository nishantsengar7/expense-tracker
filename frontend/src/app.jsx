import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./expenseform.jsx";
import ExpenseList from "./expenselist.jsx";
import SummaryReports from "./SummaryReports.jsx";
import "./styles.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchExpenses = async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.category) params.append("category", filters.category);
      const url = `http://127.0.0.1:5000/api/expenses/?${params.toString()}`;
      const res = await axios.get(url);
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to fetch expenses: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("start_date", filters.startDate);
      if (filters.endDate) params.append("end_date", filters.endDate);
      if (filters.category) params.append("category", filters.category);
      const url = `http://127.0.0.1:5000/api/expenses/summary?${params.toString()}`;
      const res = await axios.get(url);
      setSummary(res.data);
    } catch (err) {
      setError("Failed to fetch summary: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const addExpense = async (expense) => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://127.0.0.1:5000/api/expenses/", expense);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      setError("Failed to add expense: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, updatedExpense) => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`http://127.0.0.1:5000/api/expenses/${id}`, updatedExpense);
      setEditingExpense(null);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      setError("Failed to update expense: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://127.0.0.1:5000/api/expenses/${id}`);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      setError("Failed to delete expense: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
  };

  const cancelEditing = () => {
    setEditingExpense(null);
  };

  const applyFilters = () => {
    fetchExpenses({ startDate, endDate, category: selectedCategory });
    fetchSummary({ startDate, endDate, category: selectedCategory });
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    fetchExpenses();
    fetchSummary();
  };

  return (
    <div className="container">
      <h2>Personal Expense Tracker</h2>
      {error && <div className="error-message">{error}</div>}
      <ExpenseForm
        onAdd={addExpense}
        onUpdate={updateExpense}
        editingExpense={editingExpense}
        onCancel={cancelEditing}
      />
      <div className="filters">
        <h3>Filters</h3>
        {(startDate || endDate || selectedCategory) && (
          <p>Applied Filters: {startDate && `Start: ${startDate}`} {endDate && `End: ${endDate}`} {selectedCategory && `Category: ${selectedCategory}`}</p>
        )}
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="e.g., Food"
          />
        </label>
        <button onClick={applyFilters} disabled={loading}>Apply Filters</button>
        <button onClick={clearFilters} disabled={loading}>Clear Filters</button>
      </div>
      {loading && <div>Loading...</div>}
      <button onClick={fetchExpenses} disabled={loading}>Refresh Expenses</button>
      <ExpenseList
        expenses={expenses}
        onDelete={deleteExpense}
        onEdit={startEditing}
      />
      <SummaryReports summary={summary} />
    </div>
  );
}

export default App;
