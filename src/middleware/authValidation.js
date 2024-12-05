const jwt = require("jsonwebtoken");
const User = require("../models/user")

const validateUser = async (req, res, next) => {

  // Check if the Authorization header exists
  if (req.headers.authorization) {
    try {

      // Extract the token from the Authorization header
      const token = req.headers.authorization.split(" ")[1];

        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // If the token is valid, use the email from the token to find the user in the database
      if (decoded && decoded.email) {
      const user = await User.findOne({ emailAddress: decoded.email });


      if (user) {

        //If User found, attach user details to the request for further use
        req.user = user;
        console.log("Welcome to the site");
        return next(); // Move to the next middleware or route handler
      } else {
        // if User not found in the database tretun an error msg
        return res.status(403).json({ message: "Access denied. User not found." });
      }
    } else {
      //if Token is invalid (email not present)
      return res.status(403).json({ message: "Access denied. Invalid token." });
    }
  } catch (error) {
    // throw this error if token verification failed (e.g., expired, tampered, etc.)
    return res.status(403).json({ message: "Access denied. Invalid token.", error: error.message });
  }
} else {
  // No Authorization header provided
  return res.status(401).json({ message: "No token provided. Authorization denied." });
}

};

module.exports = validateUser;
