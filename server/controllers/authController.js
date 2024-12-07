import axios from "axios";
import db from "../db.js";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const googleLogin = (req, res) => {
  const googleAuth = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email%20profile`;
  res.redirect(googleAuth);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token } = tokenRes.data;

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const user = userRes.data;

    const employee = await db.oneOrNone(
      "SELECT * FROM employee WHERE email = $1",
      user.email
    );

    if (!employee) {
      return res.redirect("http://localhost:5173/?unauthorized=true");
    }

    const googleID = employee.google_id;

    if (!googleID) {
      await db.none("UPDATE employee SET google_id = $1 WHERE email = $2", [
        user.id,
        user.email,
      ]);
    }

    return res.redirect("http://localhost:5173/manager");
  } catch (error) {
    console.error(error);
  }
};

export { googleLogin, googleCallback };
