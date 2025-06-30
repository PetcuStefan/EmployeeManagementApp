const express = require("express");
const router = express.Router();
const { User, Company, Department, Employee } = require('../models');


router.get('/countCompanies', async (req, res) => {
  try {
    const user = req.user; // Passport attaches logged-in user here
    if (!user) {
      console.warn("⚠️ Unauthorized request to /countCompanies: no user in session");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log(`[Stats] Fetching counts for user googleId: ${user.googleId}`);

    const companiesCount = await Company.count({
      where: { googleId: user.googleId }
    });

    // const employeesCount = await Employee.count({
    //   where: { googleId: user.googleId }
    // });

    // console.log(`[Stats] companiesCount: ${companiesCount}, employeesCount: ${employeesCount}`);

    res.json({ companiesCount});
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;

