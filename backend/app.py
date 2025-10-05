from flask import Flask, jsonify
from flask_cors import CORS
from routes.expense_routes import expense_bp

app = Flask(__name__)
# Enable CORS for frontend origin
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
app.register_blueprint(expense_bp, url_prefix="/api/expenses")

@app.route("/")
def home():
    return jsonify({"message": "Welcome to Expense Tracker API"}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
