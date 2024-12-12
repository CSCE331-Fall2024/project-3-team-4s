import { useState } from "react";
import "./AddModal.css";
import Button from "./Button";

/**
 * @module Components
 */

/**
 * AddEmployeeModal component that provides a form to add a new employee.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onCancel - Function to cancel the modal.
 * @param {Function} props.onAdd - Function to add the employee.
 * @returns {JSX.Element} The add employee modal component.
 */
const AddEmployeeModal = ({ onCancel, onAdd }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="modal-add">
      <div className="modal-content-add">
        <h2>Add Employee</h2>
        <form className="modal-form-add">
          <input
            className="input-add"
            type="text"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="input-add"
            type="text"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="input-add"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="input-add"
            id="role"
            name="role"
            onChange={(e) => setRole(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Chef">Chef</option>
          </select>
        </form>

        <div className="modal-actions-add">
          <Button text={"Cancel"} onClick={onCancel} />
          <Button
            text={"Add"}
            onClick={() => onAdd(firstName, lastName, role, email)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
