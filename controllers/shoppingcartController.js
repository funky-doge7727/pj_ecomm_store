const express = require("express")
const controller = express.Router()

controller.get("/", (req, res) => {
    res.render("shopping_cart.ejs")
})

module.exports = controller