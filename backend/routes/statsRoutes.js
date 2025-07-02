const express = require("express");
const router = express.Router();
const { User, Company, Department, Employee } = require('../models');

router.get('/countCompanies', async (req, res) => {
  try {
    const user = req.user;
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

    if (companyIds.length === 0) {
      return res.json({ companiesCount: 0, employeesCount: 0, totalSalaries: 0 });
    }

    // Step 2: Get departments in those companies
    const departments = await Department.findAll({
      where: { company_id: companyIds },
      attributes: ['department_id']
    });

    const departmentIds = departments.map(d => d.department_id);
    console.log(`[Stats] Found ${departmentIds.length} department(s):`, departmentIds);

    if (departmentIds.length === 0) {
      return res.json({ companiesCount: companyIds.length, employeesCount: 0, totalSalaries: 0 });
    }

    // Step 3: Count employees in those departments
    const employeesCount = await Employee.count({
      where: { department_id: departmentIds }
    });

    // Step 4: Sum employee salaries
    const { sum } = await Employee.findOne({
      where: { department_id: departmentIds },
      attributes: [[Employee.sequelize.fn('SUM', Employee.sequelize.col('salary')), 'sum']],
      raw: true,
    });

    const totalSalaries = parseFloat(sum) || 0;

    // Step 5: Return response
    const companiesCount = companyIds.length;
    console.log(`[Stats] Final counts — Companies: ${companiesCount}, Employees: ${employeesCount}, Total Salaries: ${totalSalaries}`);

    // add after employeesCount & totalSalaries:
    const companyBreakdown = await Promise.all(
    userCompanies.map(async (company) => {
    const departments = await Department.findAll({
      where: { company_id: company.company_id },
      attributes: ['department_id']
    });

    const departmentIds = departments.map(d => d.department_id);

    const employees = await Employee.findAll({
      where: { department_id: departmentIds },
      attributes: ['salary']
    });

    const totalSalaries = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

    return {
      name: company.name || `Company ${company.company_id}`,
      employeesCount: employees.length,
      totalSalaries,
    };
  })
);

res.json({ companiesCount, employeesCount, totalSalaries, companyBreakdown });

  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
