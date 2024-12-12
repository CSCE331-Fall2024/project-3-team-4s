import "./PageHeader.css";

/**
 * @module Components
 */

/**
 * PageHeader component that displays the title of the page.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.pageTitle - The title of the page.
 * @returns {JSX.Element} The page header component.
 */
const PageHeader = ({ pageTitle }) => {
  return (
    <div className="page-header-container">
      <h1>{pageTitle}</h1>
    </div>
  );
};

export default PageHeader;
