const express = require("express");
const router = express.Router();
const { Company, Department } = require('../models');

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

module.exports = router;
