const express = require('express');
const router = express.Router();
const { Employee, Department } = require('../models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findOne({
    where: { employee_id: id },
    include: [
      {
        model: Department,
        attributes: ['name'],
      },
      {
        model: Employee,
        as: 'Manager',
        attributes: ['name'],
      },
    ],
  });


    if (!employee) {
      console.warn(`⚠️ Employee not found with ID: ${id}`);
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      employee_id: employee.employee_id,
      name: employee.name,
      salary: employee.salary,
      hire_date: employee.hire_date,
      department_id: employee.department_id,
      department_name: employee.Department?.name || null,
      manager_id: employee.manager_id,
      manager_name: employee.Manager?.name || null,
    });
  } catch (err) {
    console.error('❌ Error fetching employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
