const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, "data", "expenses.json");

// Ensure data file exists
function ensureDataFile() {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]", "utf8");
}

function readExpenses() {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeExpenses(expenses) {
    ensureDataFile();
    fs.writeFileSync(DATA_PATH, JSON.stringify(expenses, null, 2), "utf8");
}

// Health check
app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

// Get all expenses
app.get("/api/expenses", (req, res) => {
    const expenses = readExpenses();
    res.json(expenses);
});

// Add expense
app.post("/api/expenses", (req, res) => {
    const { date, amount, category, note } = req.body;

    if (!date || amount === undefined || amount === null || Number(amount) <= 0) {
        return res.status(400).json({ message: "date and amount (>0) are required" });
    }

    const expenses = readExpenses();
    const newItem = {
        id: crypto.randomUUID(),
        date,
        amount: Number(amount),
        category: category || "Other",
        note: note || ""
    };

    expenses.unshift(newItem);
    writeExpenses(expenses);
    res.status(201).json(newItem);
});

// Update expense
app.put("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    const expenses = readExpenses();
    const idx = expenses.findIndex(x => x.id === id);

    if (idx === -1) return res.status(404).json({ message: "Not found" });

    expenses[idx] = { ...expenses[idx], ...req.body };
    if (expenses[idx].amount !== undefined) expenses[idx].amount = Number(expenses[idx].amount);

    writeExpenses(expenses);
    res.json(expenses[idx]);
});

// Delete expense
app.delete("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    const expenses = readExpenses();
    const next = expenses.filter(x => x.id !== id);

    if (next.length === expenses.length) {
        return res.status(404).json({ message: "Not found" });
    }

    writeExpenses(next);
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
