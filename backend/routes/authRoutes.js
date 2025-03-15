const express = require("express");
const { OAuth2Client } = require("google-auth-library"); // Import Google OAuth client
const dotenv = require("dotenv");
const db = require("../models/index"); // Import database connection
const jwt = require("jsonwebtoken");

dotenv.config(); // Load environment variables

const router = express.Router();

// ✅ Initialize Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login route
// Handle Google Login
router.post("/google-login", async (req, res) => {
    const { token } = req.body;
  
    try {
      // Verify Google ID token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const email = payload.email;
      const googleId = payload.sub;
  
      // Check if the user exists by email or Google ID
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ? OR googleId = ?',
        [email, googleId]
      );
  
      let user;
      if (rows.length > 0) {
        user = rows[0]; // User found
      } else {
        // Create a new user if not found (Google Login)
        const [result] = await db.execute(
          'INSERT INTO users (email, googleId) VALUES (?, ?)',
          [email, googleId]
        );
        user = { id: result.insertId, email, googleId };
      }
  
      // Generate JWT token
      const authToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({ success: true, token: authToken, user });
    } catch (error) {
      console.error("Error during Google login:", error);
      res.status(400).json({ success: false, message: "Login failed" });
    }
  });

module.exports = router;
