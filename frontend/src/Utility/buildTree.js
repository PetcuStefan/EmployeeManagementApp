// Helper to build hierarchy tree structure

export const buildHierarchy = (employees) => {
    const employeeMap = {};
    const root = [];
  
    employees.forEach((emp) => {
      employeeMap[emp.employee_id] = { ...emp, children: [] };
    });
  
    employees.forEach((emp) => {
      if (emp.manager_id) {
        employeeMap[emp.manager_id].children.push(employeeMap[emp.employee_id]);
      } else {
        root.push(employeeMap[emp.employee_id]);
      }
    });
  
    return root;
  };
  