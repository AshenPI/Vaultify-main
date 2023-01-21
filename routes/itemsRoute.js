const express = require("express");
const localS = require("store2");
const ItemModel = require("../models/itemsModel");
const userModel = require("../models/userModel");
const bodyParser = require("body-parser");
const router = express.Router();

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

router.get("/get-all-items", async (req, res) => {
    
    //tried to access localstorage from backend    
    //   const users =  localS();
        //     console.log(users);

         

    try {
            
          const items = await ItemModel.find();
            res.send(items);                  
    
            
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/add-item", async (req, res) => {
    try {
        const newitem = new ItemModel(req.body)
        await newitem.save()
        res.send('Item added successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/edit-item", async (req, res) => {
    
    try {
        await ItemModel.findOneAndUpdate({ _id: req.body.itemId }, req.body)
        res.send('Item updated successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});



router.post("/delete-item", async (req, res) => {
    try {
        await ItemModel.findOneAndDelete({ _id: req.body.itemId })
        res.send('Item deleted successfully')
    } catch (error) {
        res.status(400).json(error);
    }
});







module.exports = router