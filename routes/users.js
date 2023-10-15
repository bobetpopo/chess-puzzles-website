const express = require("express")
const router = express.Router()
const User = require("../models/user")
const path = require("path")


router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/auth/register.html"))
})

module.exports = router