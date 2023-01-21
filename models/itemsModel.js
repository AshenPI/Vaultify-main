const mongoose = require("mongoose");

const itemsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "users"
  },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    itemId: {type: String , $inc: {seq:1}},
    
},{timestamps: true});

const itemsModel = mongoose.model("items", itemsSchema);

module.exports = itemsModel;
