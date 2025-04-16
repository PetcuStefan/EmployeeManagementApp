const express = require("express");
const router = express.Router();
const Company= require("../models/companies");
const User=require("../models/users");

router.post('/addCompany', async (req, res) => {
  const { name } = req.body;
  const googleId = req.user?.googleId;

  if (!googleId || !name) {
    console.warn("❌ Missing googleId or company name");
    return res.status(400).json({ message: 'Missing googleId or name' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { googleId } });

    if (!user) {
      console.warn("❌ No user found with that googleId");
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the new company
    const newCompany = await Company.create({
      googleId: user.googleId, // or user.googleId depending on your DB
      name,
      start_date: new Date(),
    });

    res.status(201).json({
      message: 'Company created successfully',
      company: newCompany,
    });

  } catch (error) {
    console.error("🔥 Error creating company:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/myCompanies', async (req, res) => {
  try {
    console.log("Session data:", req.session); // Log session data

    // Access googleId from passport session
    const googleId = req.session.passport?.user;

    if (!googleId) {
      console.error("No googleId found in session");
      return res.status(400).json({ message: "User not authenticated!" });
    }

    // Proceed with fetching companies if googleId exists
    const companies = await Company.findAll({
      where: { googleId: googleId },
    });

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "No companies found for this user!" });
    }

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ message: "Error fetching companies" });
  }
});


module.exports = router;
