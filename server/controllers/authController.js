import axios from "axios";
import db from "../db.js";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
// const REDIRECT_URI = "http://localhost:3000/auth/google/callback";
const FRONTEND_URL = process.env.FRONTEND_URL;
// const FRONTEND_URL = "http://localhost:5173";

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operations related to Google OAuth authentication
 */

/**
 * @swagger
 * /auth/google:
 *  get:
 *    summary: Google OAuth consent screen
 *    description: Redirects to Google OAuth consent screen for user authentication
 *    tags: [Authentication]
 *
 */
const googleLogin = (req, res) => {
  const googleAuth = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email%20profile`;
  res.redirect(googleAuth);
};

/**
 * @swagger
 * /auth/google/callback:
 *  get:
 *    summary: Google OAuth callback
 *    description: Callback URL for Google OAuth authentication
 *    tags: [Authentication]
 *    parameters:
 *     - in: query
 *       name: code
 *       required: true
 *       description: Authorization code from Google OAuth consent screen (auto-generated by Google, do not input manually)
 */
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
      return res.redirect(`${FRONTEND_URL}/?unauthorized=true`);
    }

    const googleID = employee.google_id;

    if (!googleID) {
      await db.none("UPDATE employee SET google_id = $1 WHERE email = $2", [
        user.id,
        user.email,
      ]);
    }

    const token = jwt.sign(
      {
        employeeID: employee.employee_id,
        employeeFirstName: employee.first_name,
        employeeLastName: employee.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.redirect(`${FRONTEND_URL}/employee?token=${token}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * @swagger
 * /auth/verify-manager:
 *  post:
 *    summary: Verify manager
 *    description: Verify if the user is a manager based on the employee's ID
 *    tags: [Authentication]
 *    parameters:
 *    - in: body
 *      name: managerID
 *      required: true
 *      description: Employee ID of the manager
 *      schema:
 *        type: object
 *        properties:
 *          managerID:
 *            type: integer
 *    responses:
 *     200:
 *        description: Manager verified
 *     400:
 *        description: Missing manager ID
 *     401:
 *       description: Unauthorized access
 */
const verifyManager = async (req, res) => {
  const { managerID } = req.body;

  if (!managerID) {
    return res.status(400).json({ message: "Manager ID is required" });
  }

  const employee = await db.oneOrNone(
    "SELECT role FROM employee WHERE employee_id = $1",
    managerID
  );

  const role = employee.role;

  if (role !== "Manager") {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  res.status(200).json({ message: "Manager verified" });
};

/**
 * @swagger
 * /auth/verify-token:
 *  get:
 *    summary: Verify JWT token
 *    description: Verify if the JWT token is valid
 *    tags: [Authentication]
 *    parameters:
 *    - in: header
 *      name: authorization
 *      required: true
 *      description: JWT token
 *      schema:
 *        type: string
 *        format: token
 *
 *    responses:
 *     200:
 *        description: Token valid
 *     401:
 *       description: Token not provided or invalid
 */
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: "Token not provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ valid: true });
  } catch (error) {
    return res
      .status(401)
      .json({ valid: false, message: "Token invalid or expired" });
  }
};

export { googleLogin, googleCallback, verifyManager, verifyToken };
