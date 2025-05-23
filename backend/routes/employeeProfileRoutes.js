const express = require('express');
const router = express.Router();
const { Employee, Department, SalaryHistory } = require('../models');
const { Op } = require('sequelize');


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

router.get('/salaryHistory/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const whereClause = {
      employee_id: employeeId,
    };

    if (startDate && endDate) {
      whereClause.salary_date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const history = await SalaryHistory.findAll({
      where: whereClause,
      order: [['salary_date', 'ASC']],
    });

    res.json(history);
  } catch (err) {
    console.error('❌ Error fetching salary history:', err);
    res.status(500).json({ error: 'Failed to fetch salary history' });
  }
});

module.exports = router;
