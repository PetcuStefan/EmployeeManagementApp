const express = require("express");
const router = express.Router();
const { Company, Department, Employee } = require('../models');

router.get('/:id', async (req, res) => {
  try {

    const company = await Company.findByPk(req.params.id, {
      include: [{ model: Department }],
    });


    if (!company) {
      console.warn("⚠️ Company not found with ID:", req.params.id);
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (err) {
    console.error("🔥 Error during DB query:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/:id/addDepartment", async (req, res) => {
  try {
    const companyId = req.params.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Department name is required" });

    // Check if the company exists
    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Create new department
    const department = await Department.create({
      name,
      company_id: companyId,
    });

    res.status(201).json(department);
  } catch (err) {
    console.error("Error adding department:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/DeleteCompany/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Deleting the company
    await company.destroy();
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/EmployeeList/:departmentId', async (req, res) => {
  const { id, departmentId } = req.params;

  try {
    const department = await Department.findOne({
      where: {
        department_id: departmentId,
        company_id: id,
      },
      include: [
        {
          model: Employee,
          attributes: ['employee_id', 'name', 'hire_date', 'manager_id', 'department_id'],
        },
      ],
    });

    if (!department) {
      console.warn('⚠️ No department found matching company_id and department_id');
      return res.status(404).json({ error: 'Department not found for this company' });
    }

    res.json(department.Employees);
  } catch (error) {
    console.error('❌ Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.post('/:companyId/addEmployee', async (req, res) => {
  const { companyId } = req.params;
  const { departmentId, name, hire_date } = req.body;

  try {
    // Check if the department exists
    const department = await Department.findOne({ where: { department_id: departmentId, company_id: companyId } });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Create a new employee record in the Employee table
    const newEmployee = await Employee.create({
      department_id: departmentId,
      manager_id: null,  // Assuming manager_id is optional or defaulted. Update as necessary.
      name: name,
      hire_date: new Date(hire_date),
    });

    // Return the created employee object as a response
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the employee' });
  }
});


module.exports = router;
