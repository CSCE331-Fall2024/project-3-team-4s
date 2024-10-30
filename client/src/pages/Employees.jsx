import axios from "axios";
import { useEffect, useState } from "react";
import "./Employees.css";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Icon from "../components/Icon";
import DeleteModal from "../components/DeleteModal";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/employee/get-employees"
        );
        console.log(res.data);
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  // Open delete modal
  const openDeleteModal = (employee) => {
    setShowDeleteModal(true);
    setSelectedEmployee(employee);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Delete employee
  const deleteEmployee = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/employee/delete-employee/${selectedEmployee.employee_id}`
      );

      // Re-render the employees list by removing the deleted employee
      setEmployees(
        employees.filter(
          (employee) => employee.employee_id !== selectedEmployee.employee_id
        )
      );

      setSelectedEmployee(null);
      closeDeleteModal();

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
                <th>Options</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.role}</td>
                  <td className="icons-container">
                    <Icon src="src/assets/edit-icon.svg" alt="edit icon" />
                    <Icon
                      src="src/assets/delete-icon.svg"
                      alt="delete icon"
                      onClick={() => openDeleteModal(employee)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="button-container">
        <Button text="Add Employee" />
      </div>

      {showDeleteModal && (
        <DeleteModal
          onCancel={closeDeleteModal}
          onDelete={deleteEmployee}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default Employees;
