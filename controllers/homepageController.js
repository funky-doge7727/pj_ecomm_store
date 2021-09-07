const express = require("express")

const controller = express.Router()

controller.get("/", (req, res) => {
    const success = req.query.success
    const action = req.query.action
    res.render("index.ejs", {success, action})

})

module.exports = controller