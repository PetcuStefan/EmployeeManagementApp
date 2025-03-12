const app = require("./app"); // Import the app from app.js
const db = require("./models/index"); // Import the database connection

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(5000, () => console.log("Server running on port 5000"));