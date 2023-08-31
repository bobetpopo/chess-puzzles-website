const mongoose = require('mongoose')

const puzzleSchema = new mongoose.Schema({
    puzzleId: String,
    FEN: String,
    Moves: String,
    Rating: Number,
})

const Puzzle = mongoose.model("Puzzle", puzzleSchema)

module.exports = Puzzle