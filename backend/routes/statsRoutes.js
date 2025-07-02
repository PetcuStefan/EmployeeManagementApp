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

    console.log(`[Stats] Fetching stats for user googleId: ${user.googleId}`);

    // Step 1: Get companies owned by user
    const userCompanies = await Company.findAll({
      where: { googleId: user.googleId },
      attributes: ['company_id']
    });

    const companyIds = userCompanies.map(c => c.company_id);

    console.log(`[Stats] Found ${companyIds.length} company(ies):`, companyIds);

    // Step 2: Get departments in those companies
    const departments = await Department.findAll({
      where: { company_id: companyIds },
      attributes: ['department_id']
    });

    const departmentIds = departments.map(d => d.department_id);

    console.log(`[Stats] Found ${departmentIds.length} department(s):`, departmentIds);

    // Step 3: Count employees in those departments
    const employeesCount = await Employee.count({
      where: { department_id: departmentIds }
    });

    // Step 4: Count companies
    const companiesCount = companyIds.length;

    console.log(`[Stats] Final counts — Companies: ${companiesCount}, Employees: ${employeesCount}`);

    res.json({ companiesCount, employeesCount });

  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
