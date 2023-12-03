const mongoose = require('mongoose');

const toysSchema = new mongoose.Schema({
    name: String,
    produced_country: String,
    info: {
        type: String, default: "No info"
      },
    category: String,
    img_url: {
        type: String, default: "No image"
      },
    price: Number,
    date_created: {
        type: Date, default: Date.now()
    }
})


exports.ToyModel = mongoose.model("Toys", toysSchema);