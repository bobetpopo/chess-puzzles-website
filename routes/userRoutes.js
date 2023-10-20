const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user")
const path = require("path")
const catchAsync = require("../utils/catchAsync")


router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { username, password } = req.body
        const user = new User({ username })
        const registeredUser = await User.register(user, password)
        req.flash("success", "Welcome to Chess :Puzzles!")
        res.redirect("/")
    } catch(e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    req.flash("success", "Welcome back!")
    res.redirect("/")
})

module.exports = router