const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); // Import Google login route

const db = require("./models/index"); // Import the database connection


const app = express(); // Initialize Express

// CORS Configuration
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.json()); // Allow JSON parsing

// Mount authentication routes
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
