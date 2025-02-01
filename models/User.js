const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id:{type: String, default: () => new mongoose.Types.ObjectId().toString() }, //to store _id in mongo as string
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", UserSchema);
