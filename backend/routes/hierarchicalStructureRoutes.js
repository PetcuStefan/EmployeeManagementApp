const express = require("express");
const router = express.Router();
const { Company, Department, Employee } = require('../models');

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
  

  router.put('/updateManager', async (req, res) => {
    const { draggedId, droppedId } = req.body;
    
    try {
      // Update the manager_id of the dropped employee
      const result = await Employee.update(
        { manager_id: draggedId },
        { where: { employee_id: droppedId } }
      );
  
      if (result[0] === 1) {
        res.status(200).send({ message: 'Manager updated successfully' });
      } else {
        res.status(404).send({ message: 'Employee not found' });
      }
    } catch (error) {
      console.error('Error updating manager:', error);
      res.status(500).json({ message: 'Failed to update manager' });
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
  
  
  
module.exports = router;
