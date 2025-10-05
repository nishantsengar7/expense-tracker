# Expense Tracker

A personal expense tracker application built with React frontend and Flask backend.

## Features

- **Add Expenses**: Add new expenses with amount, date, note, and category.
- **Edit Expenses**: Update existing expenses.
- **Delete Expenses**: Remove expenses from the list.
- **Filter Expenses**: Filter expenses by start date, end date, and category.
- **Summary Reports**: View total spent, breakdown by category, and by month.
- **Responsive UI**: Clean and user-friendly interface.

## Prerequisites

- Python 3.x
- Node.js and npm
- SQLite (comes with Python)

## How to Run

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install flask flask-cors
   ```

3. Run the Flask server:
   ```
   python app.py
   ```

   The backend will start on `http://127.0.0.1:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

   The frontend will open in your browser at `http://localhost:3000`.

### Usage

- Open the application in your browser.
- Add new expenses using the form.
- View all expenses in the list.
- Use the filters to narrow down expenses by date range and category.
- Check the summary section for spending insights.
- Edit or delete expenses as needed.

## API Endpoints

- `GET /api/expenses/` - Get all expenses (with optional filters)
- `POST /api/expenses/` - Add a new expense
- `PUT /api/expenses/<id>` - Update an expense
- `DELETE /api/expenses/<id>` - Delete an expense
- `GET /api/expenses/summary` - Get summary reports (with optional filters)

## Database

The application uses SQLite database (`expenses.db`) stored in the backend directory.
