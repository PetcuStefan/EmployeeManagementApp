const express = require('express');
const router = express.Router();
const { Employee, Department, SalaryHistory, ManagerHistory } = require('../models');
const { Op } = require('sequelize');

const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};


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

router.get('/supervisorHistory/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate employeeId
    if (!employeeId || isNaN(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    // Build query conditions
    const where = { employee_id: employeeId };

    // Validate and apply date filters
    if (startDate && endDate) {
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
      }
      where.manager_date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate || endDate) {
      return res.status(400).json({ message: 'Both startDate and endDate are required' });
    }

    // Fetch supervisor history with manager name
    const supervisorHistory = await ManagerHistory.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'manager',
          attributes: ['employee_id', 'name'],
          required: false, // Left join to include records even if manager_id is null
        },
      ],
      order: [['manager_date', 'ASC']],
    });

    // Get current date for end_date of the last record
    const currentDate = new Date();

    // Format response with calculated end_date
    const formattedHistory = supervisorHistory.map((entry, index, array) => {
      // Calculate end_date: use next record's manager_date or current date if last record
      const endDate = index < array.length - 1
        ? new Date(array[index + 1].manager_date)
        : currentDate;

      return {
        manager_id: entry.manager_id,
        manager_date: entry.manager_date,
        manager: entry.manager
          ? { id: entry.manager.employee_id, name: entry.manager.name }
          : null,
        end_date: endDate.toISOString(),
      };
    });

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error('❌ Error fetching supervisor history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
