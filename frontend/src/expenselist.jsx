import React from "react";

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  return (
    <ul className="expense-list">
      {expenses.map((exp) => (
        <li key={exp.id} className="expense-item">
          <div className="expense-details">
            <strong>₹{exp.amount}</strong> — {exp.note} <br />
            <small>{exp.date} - {exp.category}</small>
          </div>
          <div className="expense-actions">
            <button className="btn-secondary" onClick={() => onDelete(exp.id)}>Delete</button>
            <button className="btn-primary" onClick={() => onEdit(exp)}>Edit</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
