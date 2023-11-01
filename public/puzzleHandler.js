let puzzle = {}
let userRating

getRatingFromServer()
    .then((rating) => {
        userRating = rating
    })
    .catch((err) => {
        console.log(err)
    })

function getRatingFromServer() {
    return new Promise((resolve, reject) => {
        axios.get("http://localhost:3000/user-rating")
            .then((res) => {
                const user = res.data
                if (user.rating) {
                    resolve(user.rating)
                } else {
                    resolve(null)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

function randomPuzzle() {
    try {
        axios.get("http://localhost:3000/random-puzzle")
            .then((res) => {
                const puzzleData = res.data

                // const { FEN, Moves, Rating} = puzzleData
                // puzzleMoves = Moves.split(" ")
                // puzzleRating = Rating
                puzzle = { ...puzzleData }
                console.log(puzzle)

                clearBoard()
                startPuzzle(puzzle.FEN)
                puzzleAutoMove(puzzle.Moves.split(" ")[0])
            })
            .catch(err => {
                console.log("ERROR!")
                console.log(err)
            })
    } catch (err) {
        console.log(err)
    }
    clearMoveLog()
}

function startPuzzle(FEN) {
    flipBoardIfNeeded()
    startGame(FEN)
    // if current player is white, user plays black, so flip
    if (currentPlayer === "white") {
        flipBoard()
    }
    clearPuzzleScreen()
    document.getElementById("reset-btn").disabled = true
}

const promotionLetterMap = new Map()
promotionLetterMap.set("q", "queen")
promotionLetterMap.set("b", "bishop")
promotionLetterMap.set("r", "rook")
promotionLetterMap.set("n", "knight")
promotionLetterMap.set("", null)

function puzzleAutoMove(move) {
    // disable move nav buttons while puzzle loads
    disableGameButtons()

    setTimeout(() => {
        const start = document.getElementById(getSquareID(move.slice(0, 2)))
        const end = document.getElementById(getSquareID(move.slice(2, 4)))

        if (start.firstChild) {
            start.firstChild.click()
        }
        if (end.firstChild) {
            end.firstChild.click()
        } else {
            end.click()
        }
        // if there is a promotion: select piece
        const promotionPieceLetter = move.charAt(4) ? move.charAt(4) : ""
        const promotionPiece = promotionLetterMap.get(promotionPieceLetter)
        if (promotionPiece) {
            document.querySelector(`.selector.piece.${ promotionPiece }`).click()
        }

        enableGameButtons()
        document.getElementById("reset-btn").disabled = true
    }, 500)
}

function getSquareID(square) {
    const [column, row] = square.split("")
    const columnNumber = column.charCodeAt(0) - 96
    return columnNumber + row
}

function handlePuzzleMove(startSquare, endSquare) {
    const startCol = String.fromCharCode(96 + parseInt(startSquare.id[0]))
    const startRow = startSquare.id[1]
    const endCol = String.fromCharCode(96 + parseInt(endSquare.id[0]))
    const endRow = endSquare.id[1]

    const move = startCol + startRow + endCol + endRow
    const answerMoves = puzzle.Moves.split(" ")
    const answer = answerMoves[moveNumber - 1]

    let puzzleEnd = false
    let puzzleCorrect
    if (move === answer) {
        if (moveNumber < answerMoves.length) {
            puzzleAutoMove(answerMoves[moveNumber])
        } else {
            // no more moves to the puzzle, puzzle completed
            puzzleCorrect = true
            puzzleEnd = true
        }
    } else {
        puzzleCorrect = false
        puzzleEnd = true
    }

    if (puzzleEnd) {
        handlePuzzleEnd(puzzleCorrect)
    }
}

function handlePuzzleEnd(puzzleCorrect) {
    const puzzleStatusClass = puzzleCorrect ? "puzzle-correct" : "puzzle-incorrect"
    const puzzleStatusText = puzzleCorrect ? "Puzzle Correct!" : "Puzzle Incorrect!"
    document.getElementById("move-display-container").classList.add("half-container")
    document.getElementById("puzzle-end-screen").classList.add(puzzleStatusClass)
    document.getElementById("puzzle-status").textContent = puzzleStatusText
    document.getElementById("puzzle-rating").textContent = `Puzzle Rating: ${ puzzle.Rating }`

    if (userRating) {
        // display rating change
        const ratingChange = getRatingChange(puzzleCorrect)
        userRating += ratingChange
        const displayRatingChange = ratingChange < 0 ? `${ userRating } (${ ratingChange })` : `${ userRating } (+${ ratingChange })`
        document.getElementById("rating-change").textContent = `Your Rating: ${ displayRatingChange }`

        // update html rating display
        document.getElementById("user-rating").textContent = `Rating: ${ userRating }`
        updateServerRating(userRating)
    }
}

// win or lose 5 to 15 points of rating, average of 10
function getRatingChange(puzzleCorrect) {
    const adjustment = (parseInt(puzzle.Rating) - userRating) / 20

    let ratingChange
    if (puzzleCorrect) {
        ratingChange = Math.floor(10 + adjustment)
    } else {
        ratingChange = Math.floor(10 - adjustment)
    }

    // impose min of 5 and max of 15
    ratingChange = ratingChange < 5 ? 5 : ratingChange
    ratingChange = ratingChange > 15 ? 15 : ratingChange
    // turn rating change negative if puzzle incorrect
    ratingChange = puzzleCorrect ? ratingChange : ratingChange * -1
    return ratingChange
}

function updateServerRating(newRating) {
    console.log("updateServerRating called")
    axios.put("http://localhost:3000/update-rating", { newRating })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {s
            console.log(err)
        })
}

function clearPuzzleScreen() {
    document.getElementById("move-display-container").classList.remove("half-container")
    document.getElementById("puzzle-end-screen").classList.remove("puzzle-correct")
    document.getElementById("puzzle-end-screen").classList.remove("puzzle-incorrect")
}



// show puzzle status before doing the half container
function test() {
    // document.getElementById("move-display-container").classList.add("half-container")
    // document.getElementById("puzzle-end-screen").classList.toggle("puzzle-correct")
    // document.getElementById("puzzle-status").textContent = "Puzzle Correct!"

}
