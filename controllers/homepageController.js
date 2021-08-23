const express = require("express")

const controller = express.Router()

controller.get("/", (req, res) => {
    res.render("index.ejs")
})

module.exports = controller