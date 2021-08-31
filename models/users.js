const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }, 
    usertype: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    postalCode: { type: Number },
    phone: { type: Number },
    email: { type: String },
    usertype: { type: String },
    usertype: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);

 