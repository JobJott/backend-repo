// This file is the entry point for your the backend. It sets up and starts the (Express) server, connects to the database, initializes middleware, and configures routes(like login and sign-up).

const dotenv = require("dotenv"); //This loads environment variables from a .env file into process.env for secure storage of sensitive data (e.g., database URL, JWT secret).

// importing necessary dependencies
const express = require("express"); // Framework to build the backend server.
const connectToDB = require("./src/config/db"); // Function to establish a connection to the database.
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing between backend and frontend.
const authRoutes = require("./src/routes/auth.js"); // A route file containing authentication logic for handling user sign-up, login, and related operations.
const userRoutes = require("./src/routes/user.js"); // A route file containing user-related logic for handling user profile, update, and delete operations.
const passwordRoutes = require("./src/routes/passwordRoutes.js");
const jobRoutes = require("./src/routes/job.js");
const contactRoutes = require("./src/routes/contact.js");
const goalRoutes = require("./src/routes/goalRoutes.js");
const weeklyRoutes = require("./src/routes/weekly.js");
const notificationRoutes = require("./src/routes/notificationRoutes");

// Activates the settings from the .env file.
dotenv.config();

// Sets up the Express app so we can use it for the server.
const app = express();

// Connects to the database so we can store and retrieve data.
connectToDB();

const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with the URL of your frontend
  credentials: true, // Allow credentials (e.g., cookies)
};

// Lets the app handle requests from the frontend (even if the frontend is on a different website).
app.use(
  cors({
    origin: "*",
  })
);

// Lets the app understand and handle data sent in JSON format.
app.use(express.json());

// Define a route for authentication-related API endpoints.
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/applications", weeklyRoutes);
app.use("/api/notifications", notificationRoutes);

// Decides which port the app will run on. If no port is set in the .env file, it defaults to 8080.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
