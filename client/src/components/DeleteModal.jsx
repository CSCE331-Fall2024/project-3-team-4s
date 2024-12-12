import "./DeleteModal.css";
import Button from "./Button";

/**
 * @module Components
 */

/**
 * DeleteModal component that provides a modal to confirm deletion.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onCancel - Function to cancel the deletion.
 * @param {Function} props.onDelete - Function to confirm the deletion.
 * @param {string} props.heading - The heading text for the modal.
 * @param {string} props.text - The text content for the modal.
 * @returns {JSX.Element} The delete modal component.
 */
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
