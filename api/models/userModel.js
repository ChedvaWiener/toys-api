const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  date_created: {
    type: Date, default: Date.now()
  },
  toys: [{ type: Schema.Types.ObjectId, ref: 'Toy' }],
  role: {
    type: String, default: "user"
  }
})

exports.UserModel = mongoose.model("Users", userSchema);