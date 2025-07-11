const express = require("express");
const router = express.Router();
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { User, Company, Department, Employee } = require('../models');

router.get('/countCompanies', async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      console.warn("⚠️ Unauthorized request to /countCompanies: no user in session");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Step 1: Get companies owned by user
    const userCompanies = await Company.findAll({
      where: { googleId: user.googleId },
      attributes: ['company_id','name']
    });

    const companyIds = userCompanies.map(c => c.company_id);

    if (companyIds.length === 0) {
      return res.json({ companiesCount: 0, employeesCount: 0, totalSalaries: 0 });
    }

    // Step 2: Get departments in those companies
    const departments = await Department.findAll({
      where: { company_id: companyIds },
      attributes: ['department_id']
    });

    const departmentIds = departments.map(d => d.department_id);

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

  try {
    const departments = await Department.findAll({
      where: { company_id: companyId },
      attributes: ['department_id', 'name']
    });

    const data = await Promise.all(departments.map(async (d) => {
      const count = await Employee.count({ where: { department_id: d.department_id } });
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

  try {
    const departments = await Department.findAll({
      where: { company_id: companyId },
      attributes: ['department_id', 'name']
    });

    const data = await Promise.all(departments.map(async (d) => {
      const { sum } = await Employee.findOne({
        where: { department_id: d.department_id },
        attributes: [[Employee.sequelize.fn('SUM', Employee.sequelize.col('salary')), 'sum']],
        raw: true
      });

      const parsedSum = parseFloat(sum) || 0;
      return { department: d.name, value: parsedSum };
    }));

    res.json(data);
  } catch (err) {
    console.error(`❌ Error in /salariesPerDepartment/${companyId}:`, err);
    res.status(500).json({ error: 'Failed to fetch salary stats per department' });
  }
});

router.post('/export', async (req, res) => {
  const { companyId } = req.body;

  try {
    console.log('📥 Export route hit');

    const user = req.user;
    if (!user) {
      console.log('❌ No user found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log(`👤 User authenticated: ${user.googleId}`);

    const company = await Company.findOne({
      where: {
        googleId: user.googleId,
        company_id: companyId,
      },
      include: {
        model: Department,
        include: Employee,
      },
    });

    if (!company) {
      console.log('⚠️ No matching company found');
      return res.status(404).json({ error: 'Company not found' });
    }

    console.log(`🏢 Company found: ${company.name}`);
    console.log(`🖼️ Header image path from DB: ${company.header_image_path}`);

    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Company Summary');

    // Initialize spacing variables
    const imageHeight = 80;
    const imageWidth = 500;
    const imageRowSpan = Math.ceil(imageHeight / 20); // 6 rows for image height
    const imageRowsReserved = imageRowSpan + 1; // 7 rows reserved for image
    const spacerRows = 1; // 1 empty row between image and table
    const headerRowNumber = imageRowsReserved + spacerRows + 1; // Row 9 for headers
    const dataRowNumber = headerRowNumber + 1; // Row 10 for data

    // 🖼️ Add header image if available
    if (company.header_image_path) {
      try {
        const imagePath = path.resolve(company.header_image_path);
        console.log('📁 Resolved image path:', imagePath);

        if (fs.existsSync(imagePath)) {
          const ext = path.extname(imagePath).substring(1);
          console.log(`🧩 Image file exists. Extension: .${ext}`);
          console.log(`📐 Using hardcoded image size: ${imageWidth}x${imageHeight}`);

          const imageId = workbook.addImage({
            filename: imagePath,
            extension: ext,
          });

          summarySheet.addImage(imageId, {
            tl: { col: 0, row: 0 },
            ext: { width: imageWidth, height: imageHeight },
          });

          console.log('✅ Image added to summary sheet');

          // Set row heights for image rows
          for (let i = 1; i <= imageRowSpan; i++) {
            summarySheet.getRow(i).height = 20;
          }
        } else {
          console.warn('⚠️ Image file does NOT exist at path:', imagePath);
        }
      } catch (err) {
        console.error('❌ Error adding header image:', err);
      }
    } else {
      console.log('ℹ️ No header image path found for this company.');
    }

    // Add empty rows to reserve space for image and spacer
    for (let i = 1; i <= imageRowsReserved + spacerRows; i++) {
      summarySheet.getRow(i).values = [];
    }

    // Explicitly set header row
    summarySheet.getRow(headerRowNumber).values = ['Company', 'Departments', 'Employees', 'Total Salaries'];
    summarySheet.getRow(headerRowNumber).font = { bold: true };

    // Define column widths
    summarySheet.columns = [
      { key: 'company', width: 30 },
      { key: 'departments', width: 20 },
      { key: 'employees', width: 20 },
      { key: 'salaries', width: 20 },
    ];

    // Calculate totals
    let totalEmployees = 0;
    let totalSalaries = 0;
    company.Departments.forEach(dept => {
      totalEmployees += dept.Employees.length;
      totalSalaries += dept.Employees.reduce((sum, emp) => sum + emp.salary, 0);
    });

    // Add data row
    summarySheet.getRow(dataRowNumber).values = {
      company: company.name,
      departments: company.Departments.length,
      employees: totalEmployees,
      salaries: totalSalaries,
    };

    // Add a blank row then footer text
    summarySheet.getRow(dataRowNumber + 1).values = [];
    summarySheet.getRow(dataRowNumber + 2).values = [`Generated At: ${new Date().toLocaleString()}`];

    // 📋 Employee Details sheet
    const detailSheet = workbook.addWorksheet('Employee Details');
    detailSheet.columns = [
      { header: 'Employee ID', key: 'id', width: 15 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Salary', key: 'salary', width: 15 },
    ];

    let rowCount = 0;
    company.Departments.forEach(dept => {
      dept.Employees.forEach(emp => {
        detailSheet.addRow({
          id: emp.employee_id,
          name: emp.name,
          department: dept.name,
          salary: emp.salary,
        });
        rowCount++;
      });
    });

    detailSheet.getRow(1).font = { bold: true };
    console.log(`✅ Added ${rowCount} employee rows to Employee Details sheet`);

    // 🔽 Send Excel file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=employees_export.xlsx'
    );

    console.log('📤 Sending Excel file...');
    await workbook.xlsx.write(res);
    console.log('✅ Excel file successfully sent.');

  } catch (error) {
    console.error('❌ Error exporting employees:', error);
    res.status(500).json({ error: 'Failed to export employee data' });
  }
});

module.exports = router;
