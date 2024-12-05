const dotenv = require("dotenv"); //This loads environment variables from a .env file into process.env for secure storage of sensitive data (e.g., database URL, JWT secret).
// importing necessary dependencies
const express = require("express");
const connectToDB = require("./src/config/db");
const cors = require("cors"); //This enables Cross-Origin Resource Sharing with your frontend.
const userRouter = require("./src/routes/auth.js")

// Initialize environment variables
dotenv.config();

// starting up express
const app = express();

// Connect to the database
connectToDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
