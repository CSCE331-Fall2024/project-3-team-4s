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
 *   get:
 *     summary: Redirect to Google OAuth login
 *     description: Initiates the Google OAuth flow for user authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */
const googleLogin = (req, res) => {
  const googleAuth = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email%20profile`;
  res.redirect(googleAuth);
};

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the Google OAuth callback and exchanges the authorization code for an access token, retrieves user info, and generates a JWT token
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The authorization code returned by Google OAuth
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the frontend with JWT token in the URL
 *       500:
 *         description: Internal server error
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
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /auth/verify-manager:
 *   post:
 *     summary: Verify if an employee is a manager
 *     description: Verifies if the employee with the given ID has the "Manager" role
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerID:
 *                 type: integer
 *                 description: The ID of the manager to verify
 *     responses:
 *       200:
 *         description: Manager verified successfully
 *       400:
 *         description: Missing manager ID in the request body
 *       401:
 *         description: Unauthorized access if the employee is not a manager
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
 *   get:
 *     summary: Verify JWT token
 *     description: Verifies the validity of the provided JWT token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token not provided or invalid/expired
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
