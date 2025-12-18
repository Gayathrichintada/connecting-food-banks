require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error("❌ DB error", err);
    else console.log("📦 Database connected");
});

/* ================= DONOR ROUTES ================= */

// Register Donor
app.post("/donor/register", async (req, res) => {
    const { name, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO donors (name,password,phone,address) VALUES (?,?,?,?)",
        [name, hashedPassword, phone, address],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Donor registered successfully", donorId: result.insertId });
        }
    );
});

// Donate Food
app.post("/donor/donate", (req, res) => {
    const { donor_id, food_item, quantity } = req.body;

    db.query(
        "INSERT INTO donations (donor_id, food_item, quantity, status) VALUES (?,?,?, 'available')",
        [donor_id, food_item, quantity],
        err => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Food donated successfully" });
        }
    );
});

// Get all donations
app.get("/donations", (req, res) => {
    db.query("SELECT * FROM donations", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

/* ================= USER ROUTES ================= */

// Register User
app.post("/user/register", async (req, res) => {
    const { name, password, phone, address, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (name,password,phone,address,age) VALUES (?,?,?,?,?)",
        [name, hashedPassword, phone, address, age],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "User registered successfully", userId: result.insertId });
        }
    );
});

// User → send request to donor
app.post("/user/sendRequest", (req, res) => {
    const { user_id, donor_id, food_item, quantity } = req.body;

    db.query(
        "INSERT INTO donor_requests (user_id, donor_id, food_item, quantity, status) VALUES (?,?,?,?, 'pending')",
        [user_id, donor_id, food_item, quantity],
        err => {
            if (err) return res.status(500).json({ error: "Database error" });

            db.query(
                "UPDATE donations SET status='requested' WHERE donor_id=? AND food_item=?",
                [donor_id, food_item]
            );

            res.json({ message: "Request sent to donor successfully!" });
        }
    );
});

// Get pending requests for food bank
app.get("/requests", (req, res) => {
    const sql = `
        SELECT dr.id, u.name AS user_name, d.name AS donor_name, dr.food_item, dr.quantity, dr.status
        FROM donor_requests dr
        JOIN users u ON dr.user_id = u.id
        JOIN donors d ON dr.donor_id = d.id
        WHERE dr.status='pending'
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

/* ================= FOOD BANK ROUTES ================= */

// Food bank accepts request
app.post("/foodbank/acceptRequest", (req, res) => {
    const { request_id, donor_id } = req.body;

    // Verify donor exists
    db.query(
        "SELECT id FROM donors WHERE id=?",
        [donor_id],
        (err, donorResult) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (donorResult.length === 0) return res.status(400).json({ error: "Donor ID not found" });

            // Accept request
            db.query(
                "UPDATE donor_requests SET status='accepted' WHERE id=?",
                [request_id],
                err2 => {
                    if (err2) return res.status(500).json({ error: "Database error" });

                    db.query(
                        "UPDATE donations SET status='accepted' WHERE donor_id=?",
                        [donor_id]
                    );

                    res.json({ message: "Request accepted successfully" });
                }
            );
        }
    );
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

