const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google Login Route
router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account"  // Forces Google to ask for account selection
}));

// Google Callback Route
router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:3000/homepage", // Redirect to frontend after login
}));

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout failed");
    res.redirect("http://localhost:3000/");
  });
});

// Get Session User
router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;
