import "./GreetingPage.css";
import Button from "../components/Button"; 

const GreetingPage = ({ handlePlaceOrderClick, handleLoginClick }) => {
  return (
    <div className="GreetingPage-container">
      <div className="vbox left-box">
        <Button text="Translate" className="small-button" />
        <Button text="Accessibility Options" className="small-button" />
      </div>
      <div className="center-box">
        <h1>Panda Express</h1>
        <div className="panda-logo">
          <img src="/panda.png" alt="Panda Logo" />
        </div>
        <Button text="Place Order" onClick={handlePlaceOrderClick} className="big-button" />
      </div>
      <div className="right-box">
        <Button text="Login" onClick={handleLoginClick} className="small-button" />
      </div>
    </div>
  );
};

export default GreetingPage;