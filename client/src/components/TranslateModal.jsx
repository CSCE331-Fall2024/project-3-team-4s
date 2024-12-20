import "./TranslateModal.css";
import { useTranslate } from "../contexts/TranslateContext";
import Button from "../components/Button";

/**
 * @module Components
 */

/**
 * TranslateModal component that provides a modal to select and save a language preference.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onSave - Function to save the selected language.
 * @returns {JSX.Element} The translate modal component.
 */
const TranslateModal = ({ onSave }) => {
  const { language, setLanguage } = useTranslate();

  return (
    <div className="modal-translate">
      <div className="modal-content-translate">
        <h2>Translate</h2>

        <form className="modal-form-translate">
          <select
            className="input-add"
            id="language"
            name="language"
            onChange={(e) => {
              setLanguage(e.target.value);
              localStorage.setItem("language", e.target.value);
              console.log(e.target.value);
            }}
            defaultValue={language}
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </form>

        <Button text="Save" onClick={onSave} />
      </div>
    </div>
  );
};

export default TranslateModal;
