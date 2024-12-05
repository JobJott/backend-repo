const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //a library used to securely hash (encrypt) passwords.

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
},{timestamps:true});

// Password hashing before saving
UserSchema.pre("save", async function (next) {
  // pre(save) means: "Before saving any user document to the database, do something."
  if (!this.isModified("password")) return next();
  //If the password hasn’t been changed (e.g., updating a user's email), skip hashing.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
  // salt makes the hash unpredictable and protect against password-cracking techniques
  // the value in the salt(10) means round the more rounds the more cpu time takes and more encrypted password from brute-forces attacks
  // Even if passwords share the same initial characters, the salt ensures that each password is hashed differently
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
