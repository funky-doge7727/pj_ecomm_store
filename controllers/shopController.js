const express = require("express")
const controller = express.Router()

controller.get("/", async (req, res) => {
    const cupcakes = await Cupcake.find().sort({cakeId: 1}).exec()
    res.render("shop.ejs", {cupcakes})
})

const mongoose = require("mongoose")
const db = mongoose.connection

const Cupcake = require("../models/cupcake")
const seedData = require("../models/seed")

async function reSeed() {
    db.dropCollection("cupcakes", () => console.log("collection dropped"))
    await Cupcake.create(seedData, (e, m) => e ? e.message: console.log("seed data created"))
}
   
// DANGEROUS: Uncomment to reset database with seed data

// reSeed() 




// new route

controller.get("/new", (req, res) => {
    res.render("new.ejs")
})

// post route

controller.post("", async (req, res) => {
    let cupcakeHighestId = await Cupcake.find({},{cakeId: 1, "_id": 0}).sort({cakeId: -1}).limit(1).exec()
    cupcakeHighestId = cupcakeHighestId[0].cakeId + 1
    req.body.cakeId = cupcakeHighestId
    if (req.file) {
        req.body.imagePath = `img/${req.file.filename}`
    } else {
        req.body.imagePath = "img/404_not_found.png"
    }
    console.log(req.body)
    Cupcake.create(req.body, () => console.log("creation done"))
    res.redirect("/shop?success=true&action=post")
})

// put route

controller.put("/:id", async (req, res) => {
    if (req.file) {
        req.body.imagePath = `img/${req.file.filename}`
    } else {
        const originalCupcake = await Cupcake.findOne({cakeId: Number(req.params.id)}).exec()
        const oriImg = originalCupcake.imagePath
        req.body.imagePath = oriImg
    }
    await Cupcake.updateOne({cakeId: req.params.id}, req.body).exec()
    res.redirect(`/shop/${req.params.id}`)
})

controller.put("/:id/decreQty", async (req, res) => {
    try { 
        await Cupcake.updateOne({cakeId: req.params.id}, {$inc: {quantity: -1}}).exec()
        res.redirect(`/shop/${req.params.id}`)
    } catch {res.send("invalid option")}
})


// edit 

controller.get("/:id/edit", async (req, res)=> {
    const cupcake = await Cupcake.findOne({cakeId: req.params.id}).exec()
    res.render("edit.ejs", {cupcake})
})


// delete

controller.delete("/:id", async (req, res) => {
    await Cupcake.deleteOne({cakeId: req.params.id})
    res.redirect("/shop")
})

// show

controller.get("/:id", async (req, res) => {
    const cupcake = await Cupcake.findOne({cakeId: Number(req.params.id)}).exec()
    res.render("show.ejs", {cupcake})
})

module.exports = controller