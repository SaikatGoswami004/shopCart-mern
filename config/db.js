const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    const conn = mongoose.connect("mongodb://0.0.0.0:27017/shopcart");
    console.log("connected!!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbConnect;
