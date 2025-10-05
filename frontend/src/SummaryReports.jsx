import React from "react";

const SummaryReports = ({ summary }) => {
  if (!summary) return <p>Loading summary...</p>;

  return (
    <div className="summary">
      <h3>Total Spent: ₹{summary.total.toFixed(2)}</h3>
      <h4>By Category:</h4>
      <ul>
        {Object.entries(summary.by_category).length === 0 ? (
          <li>No expenses yet</li>
        ) : (
          Object.entries(summary.by_category).map(([category, amount]) => (
            <li key={category}>{category}: ₹{amount.toFixed(2)}</li>
          ))
        )}
      </ul>
      <h4>By Month:</h4>
      <ul>
        {Object.entries(summary.by_month).length === 0 ? (
          <li>No expenses yet</li>
        ) : (
          Object.entries(summary.by_month).map(([month, amount]) => (
            <li key={month}>{month}: ₹{amount.toFixed(2)}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SummaryReports;
