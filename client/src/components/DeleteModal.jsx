import "./DeleteModal.css";
import Button from "./Button";

const DeleteModal = ({ onCancel, onDelete, heading, text }) => {
  return (
    <div className="modal-del">
      <div className="modal-content-del">
        <h2 className="modal-header-del">{heading}</h2>

        <p className="modal-text-del">{text}</p>

        <div className="modal-actions-del">
          <Button text={"Cancel"} onClick={onCancel} />
          <Button text={"Delete"} onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
