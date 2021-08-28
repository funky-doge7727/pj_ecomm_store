const express = require("express")

const controller = express.Router()

controller.get("/", (req, res) => {
    res.render("checkout.ejs")
})

controller.get("/order-success", (req, res) => {
    console.log('test order-success')
    res.render("order_success.ejs")
})

module.exports = controller