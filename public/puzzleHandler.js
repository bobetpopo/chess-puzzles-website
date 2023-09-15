let puzzleMoves = null

function randomPuzzle() {
    try {
        axios.get("http://localhost:3000/random-puzzle")
            .then((res) => {
                const puzzle = res.data

                const { FEN, Moves } = puzzle
                puzzleMoves = Moves.split(" ")
                console.log(Moves)

                clearBoard()
                startPuzzle(FEN)
                puzzleAutoMove(Moves.split(" ")[0])
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
            document.querySelector(`.selector.piece.${promotionPiece}`).click()
        }

        enableGameButtons()
        document.getElementById("reset-btn").disabled = true
    }, 1000)
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
    const answer = puzzleMoves[moveNumber - 1]

    if (move === answer) {
        console.log("correct move!")
        if (moveNumber < puzzleMoves.length) {
            puzzleAutoMove(puzzleMoves[moveNumber])
        } else {
            // no more moves to the puzzle, puzzle completed
            puzzleCompleted()
        }
    } else {
        puzzleFailed()
    }
}

function puzzleCompleted() {
    alert("Congrats. You got the right answer!")
}

function puzzleFailed() {
    alert("You did not get the right answer.")
}

function test() {
    const testFEN = "r1bq1rk1/1pp2pp1/p1np1n1p/4p3/2B1P3/2NPPN2/PPP1Q1PP/R4RK1/ w"
    clearBoard()
    clearMoveLog()
    startGame(testFEN)
}