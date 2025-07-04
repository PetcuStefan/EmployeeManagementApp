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
      attributes: ['company_id','name']
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
      company_id: company.company_id, // ✅ Add this line
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

router.get('/employeesPerDepartment/:companyId', async (req, res) => {
  const { companyId } = req.params;
  console.log(`📊 [EMPLOYEES] Fetching employee count per department for company ${companyId}`);

  try {
    const departments = await Department.findAll({
      where: { company_id: companyId },
      attributes: ['department_id', 'name']
    });

    console.log(`📁 Found ${departments.length} departments for company ${companyId}`);

    const data = await Promise.all(departments.map(async (d) => {
      const count = await Employee.count({ where: { department_id: d.department_id } });
      console.log(`📌 Department: ${d.name}, Employees: ${count}`);
      return { department: d.name, value: count };
    }));

    res.json(data);
  } catch (err) {
    console.error(`❌ Error in /employeesPerDepartment/${companyId}:`, err);
    res.status(500).json({ error: 'Failed to fetch employee stats per department' });
  }
});


router.get('/salariesPerDepartment/:companyId', async (req, res) => {
  const { companyId } = req.params;
  console.log(`💰 [SALARIES] Fetching salary totals per department for company ${companyId}`);

  try {
    const departments = await Department.findAll({
      where: { company_id: companyId },
      attributes: ['department_id', 'name']
    });

    console.log(`📁 Found ${departments.length} departments for company ${companyId}`);

    const data = await Promise.all(departments.map(async (d) => {
      const { sum } = await Employee.findOne({
        where: { department_id: d.department_id },
        attributes: [[Employee.sequelize.fn('SUM', Employee.sequelize.col('salary')), 'sum']],
        raw: true
      });

      const parsedSum = parseFloat(sum) || 0;
      console.log(`📌 Department: ${d.name}, Total Salaries: ${parsedSum}`);
      return { department: d.name, value: parsedSum };
    }));

    res.json(data);
  } catch (err) {
    console.error(`❌ Error in /salariesPerDepartment/${companyId}:`, err);
    res.status(500).json({ error: 'Failed to fetch salary stats per department' });
  }
});



module.exports = router;
