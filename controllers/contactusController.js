const express = require("express")
const controller = express.Router()

controller.get("/", (req, res) => {
    res.render("contact_us.ejs")
})

module.exports = controller