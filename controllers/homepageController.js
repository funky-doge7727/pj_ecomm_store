const express = require("express")

const controller = express.Router()

controller.get("/", (req, res) => {
    const success = req.query.success
    const action = req.query.action
    const requiredlogin = req.query.requiredlogin
    res.render("index.ejs", {success, action, requiredlogin})

})

module.exports = controller