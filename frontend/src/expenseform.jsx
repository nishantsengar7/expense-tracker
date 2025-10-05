import React, { useState, useEffect } from "react";

const ExpenseForm = ({ onAdd, onUpdate, editingExpense, onCancel }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("General");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setDate(editingExpense.date);
      setNote(editingExpense.note);
      setCategory(editingExpense.category || "General");
    } else {
      setAmount("");
      setDate("");
      setNote("");
      setCategory("General");
    }
    setErrors({});
  }, [editingExpense]);

  const validate = () => {
    const newErrors = {};
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date = "Date cannot be in the future";
      }
    }
    if (!note) {
      newErrors.note = "Note is required";
    } else if (note.length < 1 || note.length > 100) {
      newErrors.note = "Note must be between 1 and 100 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editingExpense) {
        onUpdate(editingExpense.id, { amount: parseFloat(amount), date, note, category });
      } else {
        onAdd({ amount: parseFloat(amount), date, note, category });
      }
      if (!editingExpense) {
        setAmount("");
        setDate("");
        setNote("");
        setCategory("General");
      }
      setErrors({});
    }
  };

  const handleCancel = () => {
    onCancel();
    setAmount("");
    setDate("");
    setNote("");
    setCategory("General");
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div>
        <input
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => { setAmount(e.target.value); setErrors({ ...errors, amount: "" }); }}
          className={errors.amount ? "input-error" : ""}
        />
        {errors.amount && <div className="error">{errors.amount}</div>}
      </div>
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setErrors({ ...errors, date: "" }); }}
          className={errors.date ? "input-error" : ""}
        />
        {errors.date && <div className="error">{errors.date}</div>}
      </div>
      <div>
        <input
          type="text"
          value={note}
          placeholder="Note"
          onChange={(e) => { setNote(e.target.value); setErrors({ ...errors, note: "" }); }}
          className={errors.note ? "input-error" : ""}
        />
        {errors.note && <div className="error">{errors.note}</div>}
      </div>
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select-category">
          <option value="General">General</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button type="submit" className="btn-primary">{editingExpense ? "Update Expense" : "Add Expense"}</button>
      {editingExpense && <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>}
    </form>
  );
};

export default ExpenseForm;
