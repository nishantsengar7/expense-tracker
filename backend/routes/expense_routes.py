from flask import Blueprint, request, jsonify
import sqlite3
from datetime import datetime

conn = sqlite3.connect('expenses.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    date TEXT,
    note TEXT,
    category TEXT
)''')
conn.commit()

# Ensure category column exists (for backward compatibility)
try:
    cursor.execute("ALTER TABLE expenses ADD COLUMN category TEXT DEFAULT 'General'")
    conn.commit()
except sqlite3.OperationalError:
    pass  # Column already exists

expense_bp = Blueprint("expenses", __name__)

# Add expense
@expense_bp.route("/", methods=["POST"])
def add_expense():
    data = request.json
    if not all(k in data for k in ("amount", "date", "note")):
        return jsonify({"error": "Missing required fields: amount, date, note"}), 400
    try:
        amount = float(data["amount"])
        if amount <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
        date_str = data["date"]
        date_obj = datetime.fromisoformat(date_str)
        if date_obj > datetime.now():
            return jsonify({"error": "Date cannot be in the future"}), 400
        date_str = date_obj.strftime('%Y-%m-%d')
        note = data["note"]
        if not note or len(note) < 1 or len(note) > 100:
            return jsonify({"error": "Note must be between 1 and 100 characters"}), 400
    except ValueError:
        return jsonify({"error": "Invalid data types"}), 400
    try:
        category = data.get("category", "General").strip().title()
        cursor.execute("INSERT INTO expenses (amount, date, note, category) VALUES (?, ?, ?, ?)",
                       (amount, date_str, note, category))
        conn.commit()
        return jsonify({"message": "Expense added", "id": cursor.lastrowid}), 201
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Get all expenses with optional filters
@expense_bp.route("/", methods=["GET"])
def get_expenses():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    category = request.args.get("category")

    query = "SELECT id, amount, date, note, category FROM expenses"
    conditions = []
    params = []

    if start_date:
        conditions.append("date >= ?")
        params.append(start_date)
    if end_date:
        conditions.append("date <= ?")
        params.append(end_date)
    if category:
        conditions.append("LOWER(category) = LOWER(?)")
        params.append(category)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    try:
        cursor.execute(query, params)
        rows = cursor.fetchall()
        data = [{"id": row[0], "amount": row[1], "date": row[2], "note": row[3], "category": row[4]} for row in rows]
        return jsonify(data), 200
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Update expense
@expense_bp.route("/<int:id>", methods=["PUT"])
def update_expense(id):
    data = request.json
    if not all(k in data for k in ("amount", "date", "note")):
        return jsonify({"error": "Missing required fields: amount, date, note"}), 400
    try:
        amount = float(data["amount"])
        if amount <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
        date_str = data["date"]
        date_obj = datetime.fromisoformat(date_str)
        if date_obj > datetime.now():
            return jsonify({"error": "Date cannot be in the future"}), 400
        date_str = date_obj.strftime('%Y-%m-%d')
        note = data["note"]
        if not note or len(note) < 1 or len(note) > 100:
            return jsonify({"error": "Note must be between 1 and 100 characters"}), 400
    except ValueError:
        return jsonify({"error": "Invalid data types"}), 400
    try:
        category = data.get("category", "General").strip().title()
        cursor.execute("UPDATE expenses SET amount=?, date=?, note=?, category=? WHERE id=?",
                       (amount, date_str, note, category, id))
        conn.commit()
        if cursor.rowcount > 0:
            return jsonify({"message": "Expense updated"}), 200
        return jsonify({"error": "Expense not found"}), 404
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Delete expense
@expense_bp.route("/<int:id>", methods=["DELETE"])
def delete_expense(id):
    try:
        cursor.execute("DELETE FROM expenses WHERE id=?", (id,))
        conn.commit()
        if cursor.rowcount > 0:
            return jsonify({"message": "Expense deleted"}), 200
        return jsonify({"error": "Expense not found"}), 404
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Get summary reports
@expense_bp.route("/summary", methods=["GET"])
def get_summary():
    print("get_summary called")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    category = request.args.get("category")
    print(f"Args: start_date={start_date}, end_date={end_date}, category={category}")

    conditions = []
    params = []

    if start_date:
        conditions.append("date >= ?")
        params.append(start_date)
    if end_date:
        conditions.append("date <= ?")
        params.append(end_date)
    if category:
        conditions.append("LOWER(category) = LOWER(?)")
        params.append(category)

    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
    print(f"where_clause: '{where_clause}', params: {params}")

    try:
        # Total spent
        query = f"SELECT SUM(amount) FROM expenses{where_clause}"
        print(f"Executing total: {query} with {params}")
        cursor.execute(query, params)
        total_row = cursor.fetchone()
        total = total_row[0] if total_row[0] is not None else 0
        print(f"Total: {total}")

        # Group by category
        query = f"SELECT category, SUM(amount) FROM expenses{where_clause} GROUP BY category"
        print(f"Executing category: {query} with {params}")
        cursor.execute(query, params)
        category_rows = cursor.fetchall()
        by_category = {row[0]: row[1] for row in category_rows}
        print(f"By category: {by_category}")

        # Group by month
        query = f"SELECT strftime('%Y-%m', date) as month, SUM(amount) FROM expenses{where_clause} GROUP BY month"
        print(f"Executing month: {query} with {params}")
        cursor.execute(query, params)
        month_rows = cursor.fetchall()
        by_month = {row[0]: row[1] for row in month_rows}
        print(f"By month: {by_month}")

        return jsonify({"total": total, "by_category": by_category, "by_month": by_month}), 200
    except Exception as e:
        print(f"Error in get_summary: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
