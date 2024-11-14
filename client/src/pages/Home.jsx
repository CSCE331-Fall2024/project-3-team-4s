import { useNavigate } from "react-router-dom";
import "./Home.css";
import Button from "../components/Button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-left">
        <Button text="Translate" className="med-custom-button" />
        <Button text="Accessibility Options" className="med-custom-button" />
      </div>

      <div className="home-center">
        <h1 className="home-heading">Panda Express</h1>

        <img className="panda-logo" src="/panda.png" alt="Panda Logo" />

        <Button
          text="Place Order"
          onClick={() => navigate("/customer")}
          className="big-custom-button"
        />
      </div>

      <div className="home-right">
        <Button
          text="Manager"
          onClick={() => navigate("/manager")}
          className="med-custom-button"
        />
        <Button
          text="Cashier"
          onClick={() => navigate("/cashier")}
          className="med-custom-button"
        />
      </div>
    </div>
  );
};

export default Home;
