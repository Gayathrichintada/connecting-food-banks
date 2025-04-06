require('dotenv').config({ path: './.env' });

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Food Bank Registration
app.post("/foodbank/register", async (req, res) => {
    try {
        const { name, password, number, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, password, number, address, role) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [name, hashedPassword, number, address, "foodbank"], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Food bank registered successfully", userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Donor Registration
app.post("/donor/register", async (req, res) => {
    try {
        const { name, password, number, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, password, number, address, role) VALUES (?, ?, ?, ?, ?)";
        connection.query(query, [name, hashedPassword, number, address, "donor"], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Donor registered successfully", userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Registration
app.post("/user/register", async (req, res) => {
    try {
        const { name, password, age, number, requestedFood, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, password, age, number, requestedFood, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [name, hashedPassword, age, number, requestedFood, address, "user"], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User registered successfully", userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Login
app.post("/login", (req, res) => {
    const { number, password } = req.body;

    const query = "SELECT * FROM users WHERE number = ?";
    connection.query(query, [number], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, results[0].password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            userId: results[0].id,
            role: results[0].role,
            name: results[0].name
        });
    });
});

// Donor Donation
app.post("/donate", (req, res) => {
    const { donor_id, food_item, quantity } = req.body;
    const query = "INSERT INTO donations (donor_id, food_item, quantity) VALUES (?, ?, ?)";

    connection.query(query, [donor_id, food_item, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Food donation recorded successfully" });
    });
});

// User Food Request
app.post("/request", (req, res) => {
    const { user_id, food_item } = req.body;
    const query = "INSERT INTO requests (user_id, food_item) VALUES (?, ?)";

    connection.query(query, [user_id, food_item], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Food request submitted successfully" });
    });
});

// Get Available Donations
app.get("/donations", (req, res) => {
    const query = "SELECT * FROM donations";

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// Get Requests
app.get("/requests", (req, res) => {
    const query = "SELECT * FROM requests";

    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/", (req, res) => {
    res.send("Food Bank API is running!");
});
app.get("/donations/available", (req, res) => {
    const query = "SELECT * FROM donations WHERE quantity > 0";
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});
