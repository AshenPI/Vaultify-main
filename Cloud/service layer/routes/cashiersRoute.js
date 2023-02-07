const express = require("express");
const cashiersModel = require("../models/cashiersModel");
const CashierModel = require("../models/cashiersModel");
const router = express.Router();

router.get("/get-all-cashiers", async (req, res) => {
    try {
        const cashiers = await CashierModel.find();
        res.send(cashiers);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/add-cashier", async (req, res) => {
    try {
        const newcashier = new CashierModel({...req.body , isAdmin: false});
        await newcashier.save()
        res.send('cashier added successfully')
        
    } catch (error) {
        res.status(400).json(error);
    }
});

router.put("/edit-cashier", async (req, res) => {
    try {
       
        
         await CashierModel.findOneAndUpdate({_id: req.body.cashierId} , req.body);
                
            
        res.send('cashier updated successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});



router.post("/delete-cashier", async (req, res) => {
    try {
        await CashierModel.findOneAndDelete({ _id: req.body.cashierId })
        res.send('cashier deleted successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});







module.exports = router