import "./Icon.css";

/**
 * @module Components
 */

/**
 * Icon component that renders an image icon.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alt text for the image.
 * @param {Function} [props.onClick] - The function to call when the icon is clicked.
 * @returns {JSX.Element} The icon component.
 */
const Icon = ({ src, alt, onClick }) => {
  return <img className="icon" src={src} alt={alt} onClick={onClick} />;
};

export default Icon;
