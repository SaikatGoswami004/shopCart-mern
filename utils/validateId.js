const mongoose = require("mongoose");
const validateId = (id) => {
  const isvalid = mongoose.Types.ObjectId.isValid(id);
  if (!isvalid) {
    throw new Error("This id is not valid or not found");
  }
};
module.exports = { validateId };
