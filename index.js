const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Puzzle = require("./models/puzzle")
const User = require("./models/user")

const userRoutes = require("./routes/users")

app.listen(3000, () => {
    console.log("listening on port 3000")
})

main().catch(err => console.log(err))
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/chessApp')
    console.log("Mongo connection open")
}

app.use(express.static('public/game'))
app.use("/", userRoutes)


app.get("/random-puzzle", async (req, res) => {
    const random = Math.floor(Math.random() * 100000)
    try {
        const randomPuzzle = await Puzzle.findOne().skip(random)
        res.json(randomPuzzle)
    } catch (err) {
        console.log('Error fetching puzzles:', err)
    }
})