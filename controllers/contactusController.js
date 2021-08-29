require("dotenv").config()

const express = require("express")
const controller = express.Router()

controller.get("/", (req, res) => {
    res.render("contact_us.ejs", {goog_map: process.env.GOOG_MAP_API_KEY})
})

module.exports = controller