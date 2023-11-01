const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const Puzzle = require("./models/puzzle")
const User = require("./models/user")
const ejsMate = require("ejs-mate")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")

const userRoutes = require("./routes/userRoutes")

main().catch(err => console.log(err))
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chessApp')
    console.log("Mongo connection open")
}

app.set('views', path.join(__dirname, 'views'))
app.engine("ejs", ejsMate)
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: "temp",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}))
app.use(flash())

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/", userRoutes)

app.get("/", (req, res) => {
    res.render("home",)
})

app.get("/random-puzzle", catchAsync(async (req, res) => {
    const random = Math.floor(Math.random() * 100000)
    const randomPuzzle = await Puzzle.findOne().skip(random)

    res.json(randomPuzzle)
}))

app.get("/user-rating", catchAsync(async (req, res) => {
    const user = req.user
    res.json(user)
}))

app.put("/update-rating", catchAsync(async (req, res) => {
    const {newRating} = req.body
    await User.findOneAndUpdate({username: req.user.username}, {rating: newRating})
    res.json({ success: true, message: 'Rating updated successfully.' })
}))

app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Uh Oh, something went wrong."
    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("listening on port 3000")
})
