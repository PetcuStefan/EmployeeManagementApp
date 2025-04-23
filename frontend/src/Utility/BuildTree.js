export const buildEmployeeTree = (employees) => {
  const map = {};
  const roots = [];

  employees.forEach((emp) => {
      map[emp.employee_id] = { ...emp, children: [] };
  });

  employees.forEach((emp) => {
      if (emp.manager_id && map[emp.manager_id]) {
          map[emp.manager_id].children.push(map[emp.employee_id]);
      } else {
          roots.push(map[emp.employee_id]);
      }
  });

  return roots;
};