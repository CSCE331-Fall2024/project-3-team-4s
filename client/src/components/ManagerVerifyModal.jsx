import { useState } from "react";
import "./ManagerVerifyModal.css";
import Button from "./Button";

const ManagerVerifyModal = ({ onCancel, onVerify }) => {
  const [managerID, setManagerID] = useState("");

  return (
    <div className="modal-verify">
      <div className="modal-content-verify">
        <h2>Verify Manager ID</h2>
        <form className="modal-form-verify">
          <input
            className="input-verify"
            type="number"
            placeholder="Manager ID"
            onChange={(e) => setManagerID(e.target.value)}
          />
        </form>

        <div className="modal-actions-verify">
          <Button text={"Cancel"} onClick={onCancel} />
          <Button text={"Verify"} onClick={() => onVerify(managerID)} />
        </div>
      </div>
    </div>
  );
};

export default ManagerVerifyModal;
