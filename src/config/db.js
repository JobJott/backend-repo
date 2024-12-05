const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log("connected to db and running on port", process.env.PORT);
      });
    })
    .catch((err) => {
      console.error("Connection error:", err);
      process.exit(1);
    });
};

module.exports = connectToDB;
