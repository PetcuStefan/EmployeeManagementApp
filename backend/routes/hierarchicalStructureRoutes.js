const express = require("express");
const router = express.Router();
const { Company, Department, Employee } = require('../models');

router.get('/:departmentId/EmployeeList', async (req, res) => {
    const { departmentId } = req.params;
    
    // Log the incoming departmentId to ensure it's being passed correctly
    console.log('Received departmentId:', departmentId);
  
    try {
      // Log the start of the database query
      console.log('Fetching employees for departmentId:', departmentId);
  
      // Fetch the employees from the database
      const employees = await Employee.findAll({
        where: { department_id: departmentId },
        attributes: ['employee_id', 'name', 'manager_id'],
        order: [['employee_id', 'ASC']],
      });
  
      // Log the number of employees retrieved
      console.log('Employees retrieved:', employees.length);
  
      // Check if no employees are returned
      if (employees.length === 0) {
        console.log('No employees found for this department');
        return res.status(404).json({ message: 'No employees found for this department' });
      }
  
      // Convert the Sequelize instances into plain objects
      const employeesData = employees.map(employee => employee.toJSON());
  
      // Log the data that will be sent in the response
      console.log('Employees Data:', employeesData);
  
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
  
module.exports = router;
