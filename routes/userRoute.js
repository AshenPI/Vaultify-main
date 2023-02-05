const express = require("express");
const UserModel = require("../models/userModel");
const CashierModel = require("../models/cashiersModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const validate = require("express-validator");

router.post("/login", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      userName: req.body.userName,
    });
     
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.send(user);
      } else {
        res.status(400).json({ message: "login failed" });
      }
    }

    const cashier = await CashierModel.findOne({
      userName: req.body.userName,
    });

    if (cashier) {
      if (await bcrypt.compare(req.body.password, cashier.password)) {
        res.send(cashier);
      } else {
        res.status(400).json({ message: "Login failed" });
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
  next();
});

router.put("/edit-admin", async (req, res) => {
  try {
     
      
       await UserModel.findOneAndUpdate({userName: req.body.userName} , req.body);
              
          
      res.send('admin updated successfully')
  } catch (error) {
      res.status(400).json(error);
  }
});

router.post("/register", async (req, res) => {
  try {
   
    const reg = new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$");
    const newuser = new UserModel({isAdmin: false  , ...req.body });


    
      await newuser.save();
  

      
    res.send("User Registered successfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
