const express = require("express");
const router = express.Router();
const { Company, Department, Employee, ManagerHistory } = require('../models');

router.get('/:departmentId/EmployeeList', async (req, res) => {
    const { departmentId } = req.params;
      
    try {
      // Fetch the employees from the database
      const employees = await Employee.findAll({
        where: { department_id: departmentId },
        attributes: ['employee_id', 'name', 'manager_id'],
        order: [['employee_id', 'ASC']],
      });

      // Check if no employees are returned
      if (employees.length === 0) {
        return res.status(404).json({ message: 'No employees found for this department' });
      }
  
      // Convert the Sequelize instances into plain objects
      const employeesData = employees.map(employee => employee.toJSON());
    
      // Send the response with the employees data
      res.status(200).json(employeesData);
    } catch (error) {
      // Log the error if something goes wrong during the fetch
      console.error('Error fetching employee list:', error);
  
      // Send an error response
      res.status(500).json({ message: 'Failed to retrieve employees' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the employee has subordinates
      const hasChildren = await Employee.findOne({
        where: { manager_id: id },
      });
  
      if (hasChildren) {
        return res.status(400).json({ message: 'Cannot delete employee with subordinates' });
      }
  
      // Proceed to delete only if no subordinates
      const deletedCount = await Employee.destroy({
        where: { employee_id: id },
      });
  
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.put('/changeSupervisor', async (req, res) => {
  const { employeeId, newSupervisorId } = req.body;

  if (!employeeId || !newSupervisorId) {
    return res.status(400).json({ message: 'Both employeeId and newSupervisorId are required' });
  }

  if (parseInt(employeeId) === parseInt(newSupervisorId)) {
    return res.status(400).json({ message: 'An employee cannot be their own supervisor.' });
  }

  try {
    const employee = await Employee.findByPk(employeeId);
    const newSupervisor = await Employee.findByPk(newSupervisorId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!newSupervisor) {
      return res.status(404).json({ message: 'New supervisor not found' });
    }

    if (employee.department_id !== newSupervisor.department_id) {
      return res.status(400).json({ message: 'Supervisor must be in the same department' });
    }

    // Recursive check for circular hierarchy
    const isCircular = async (currentId) => {
      const subordinates = await Employee.findAll({ where: { manager_id: currentId } });
      for (const sub of subordinates) {
        if (sub.employee_id === parseInt(newSupervisorId)) {
          return true;
        }
        const deeper = await isCircular(sub.employee_id);
        if (deeper) return true;
      }
      return false;
    };

    const causesCycle = await isCircular(employeeId);

    if (causesCycle) {
      return res.status(400).json({ message: 'Cannot assign a subordinate as supervisor (circular hierarchy)' });
    }

    // Update supervisor
    const result = await Employee.update(
      { manager_id: newSupervisorId },
      { where: { employee_id: employeeId } }
    );

    if (result[0] === 1) {
      // Log new manager in manager_history
      await ManagerHistory.create({
        employee_id: employeeId,
        manager_id: newSupervisorId,
        manager_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(200).json({ message: 'Supervisor updated and history logged' });
    } else {
      return res.status(400).json({ message: 'No update performed' });
    }

  } catch (error) {
    console.error('❌ Error updating supervisor:', error);
    return res.status(500).json({ message: 'Failed to update supervisor' });
  }
});

  
module.exports = router;
