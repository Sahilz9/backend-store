const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    title: { type: String, required: true },
    rating: Number,
  },
  {
    versionKey: false,
  }
);

const userModel = model("users", userSchema);

module.exports = userModel;
