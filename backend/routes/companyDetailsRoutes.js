const express = require("express");
const router = express.Router();
const { Company, Department, Employee } = require('../models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByPk(id, {
      include: [
        {
          model: Department,
          include: [
            {
              model: Employee,
              attributes: ['employee_id', 'name', 'hire_date', 'manager_id', 'department_id'],
            },
          ],
        },
      ],
    });

    if (!company) {
      console.warn(`⚠️ No company found with ID: ${id}`);
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('❌ Error fetching company details:', error);
    res.status(500).json({ error: 'Failed to fetch company details' });
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

router.post('/:id/addEmployee', async (req, res) => {
  const { departmentId, name, salary, hire_date, supervisor_id } = req.body;

  try {
    const department = await Department.findByPk(departmentId, {
      include: [Employee],
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Supervisor ID validation
    if (supervisor_id) {
      const supervisorExists = department.Employees.some(
        (emp) => emp.employee_id === Number(supervisor_id)
      );
      if (!supervisorExists) {
        return res.status(400).json({ error: 'Supervisor ID does not exist in this department' });
      }
    }

    const newEmployee = await Employee.create({
      name,
      salary,
      hire_date,
      department_id: departmentId,
      manager_id: supervisor_id || null,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('❌ Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});



router.delete('/:departmentId/deleteDepartment', async (req, res) => {
    const { departmentId } = req.body;

  if (!departmentId) {
    return res.status(400).json({ message: 'Department ID is required' });
  }

  try {
    // Replace with your actual DB deletion logic
    // For example, using Sequelize or a raw SQL query
    const result = await Department.destroy({
      where: {
        department_id: departmentId,
      },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Department not found or already deleted' });
    }

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting department' });
  }
});


module.exports = router;
