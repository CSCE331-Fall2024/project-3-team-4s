import { useState } from "react";
import "./EditModal.css";
import Button from "./Button";

const EditEmployeeModal = ({ onCancel, onEdit, employee }) => {
  const [firstName, setFirstName] = useState(employee.first_name);
  const [lastName, setLastName] = useState(employee.last_name);
  const [role, setRole] = useState(employee.role);
  const [email, setEmail] = useState(employee.email);

  return (
    <div className="modal-edit">
      <div className="modal-content-edit">
        <h2>Edit Employee</h2>
        <form className="modal-form-edit">
          <input
            className="input-edit"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="input-edit"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="input-edit"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="input-edit"
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Chef">Chef</option>
          </select>
        </form>

        <div className="modal-actions-edit">
          <Button text={"Cancel"} onClick={onCancel} />
          <Button
            text={"Update"}
            onClick={() => onEdit(firstName, lastName, role, email)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
