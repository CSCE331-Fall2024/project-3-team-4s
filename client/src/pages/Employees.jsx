import axios from "axios";
import { useEffect, useState } from "react";
import "./Employees.css";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Icon from "../components/Icon";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import DeleteModal from "../components/DeleteModal";

const Employees = () => {
  // const backendURL = import.meta.env.VITE_BACKEND_URL;
  const backendURL = "http://localhost:3000";

  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${backendURL}/employee/get-employees`);

        console.log(res.data);
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  // Modal functions
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (employee) => {
    setShowEditModal(true);
    setSelectedEmployee(employee);
  };

  const openDeleteModal = (employee) => {
    setShowDeleteModal(true);
    setSelectedEmployee(employee);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  // Button handlers
  const addEmployee = async (firstName, lastName, role) => {
    try {
      const employee = {
        first_name: firstName,
        last_name: lastName,
        role: role,
      };

      const res = await axios.post(
        `${backendURL}/employee/add-employee`,
        employee
      );

      // Re-render the employees list by adding the new employee
      setEmployees([...employees, res.data.employee]);
      closeAddModal();

      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const editEmployee = async (firstName, lastName, role) => {
    try {
      const employee = {
        first_name: firstName,
        last_name: lastName,
        role: role,
      };

      const res = await axios.put(
        `${backendURL}/employee/update-employee/${selectedEmployee.employee_id}`,
        employee
      );

      // Re-render the employees list by updating the edited employee
      setEmployees(
        employees.map((employee) =>
          employee.employee_id === selectedEmployee.employee_id
            ? { ...employee, ...res.data.employee }
            : employee
        )
      );

      setSelectedEmployee(null);
      closeEditModal();

      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEmployee = async () => {
    try {
      const res = await axios.put(
        `${backendURL}/employee/delete-employee/${selectedEmployee.employee_id}`
      );

      // Re-render the employees list by removing the deleted employee
      setEmployees(
        employees.filter(
          (employee) => employee.employee_id !== selectedEmployee.employee_id
        )
      );

      setSelectedEmployee(null);
      closeDeleteModal();

      alert(res.data.message);
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
                <th>Actions</th>
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
                    <Icon
                      src="/edit-icon.svg"
                      alt="edit icon"
                      onClick={() => openEditModal(employee)}
                    />
                    <Icon
                      src="/delete-icon.svg"
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
      <div className="employee-buttons-container">
        <Button text="+" onClick={openAddModal} />
      </div>

      {showAddModal && (
        <AddEmployeeModal onCancel={closeAddModal} onAdd={addEmployee} />
      )}

      {showEditModal && (
        <EditEmployeeModal
          onCancel={closeEditModal}
          onEdit={editEmployee}
          employee={selectedEmployee}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onCancel={closeDeleteModal}
          onDelete={deleteEmployee}
          heading={"Delete Employee"}
          text={`Are you sure you want to delete ${selectedEmployee.first_name} ${selectedEmployee.last_name}?`}
        />
      )}
    </div>
  );
};

export default Employees;
