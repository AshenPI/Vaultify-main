const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId , 
    ref: "users"
  },
  cashierName: {type: String, required: true},
  customerName: { type: String},
  customerPhoneNumber : {type:String},
  totalAmount: { type: Number, required: true },
  tax: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  paymentMode : {type:String , required:true},
  cartItems : {type:Array , required:true}
}, {timestamps : true});

const billModel = mongoose.model("bills", billSchema);

module.exports = billModel;
