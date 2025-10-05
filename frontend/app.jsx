import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./expenseform.jsx";
import ExpenseList from "./expenselist.jsx";
import SummaryReports from "./SummaryReports.jsx";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ total: 0, by_category: {}, by_month: {} });
  const [showSummary, setShowSummary] = useState(false);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses/");
    setExpenses(res.data);
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const addExpense = async (expense) => {
    await axios.post("http://localhost:5000/api/expenses/", expense);
    fetchExpenses();
    fetchSummary();
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    fetchExpenses();
    fetchSummary();
  };

  return (
    <div className="container">
      <h2>Personal Expense Tracker</h2>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      <button onClick={() => setShowSummary(!showSummary)}>
        {showSummary ? "Hide Summary Reports" : "Show Summary Reports"}
      </button>
      {showSummary && <SummaryReports summary={summary} />}
    </div>
  );
}

export default App;
