import axios from "axios";
import { useEffect, useState } from "react";
import "./Employees.css";
import PageHeader from "../components/PageHeader";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:3000/employee/employees");

        setEmployees(res.data);
        console.log(res);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="employees-container">
      <PageHeader pageTitle="Employees" />

      <div className="table-outer-container">
        <div className="table-inner-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
