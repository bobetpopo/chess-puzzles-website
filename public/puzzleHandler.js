function randomPuzzle() {
    try {
        axios.get("http://localhost:3000/random-puzzle")
            .then((res) => {
                const puzzle = res.data

                const { FEN, Moves } = puzzle
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

const promotionLetterMap = new Map()
promotionLetterMap.set("q", "queen")
promotionLetterMap.set("b", "bishop")
promotionLetterMap.set("r", "rook")
promotionLetterMap.set("n", "knight")
promotionLetterMap.set("", null)

function puzzleAutoMove(move) {
    // disable move nav buttons while puzzle loads
    document.getElementById("rewind-move-btn").disabled = true
    document.getElementById("next-move-btn").disabled = true
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

        // enable move nav
        document.getElementById("rewind-move-btn").disabled = false
        document.getElementById("next-move-btn").disabled = false
    }, 1000)
}

function getSquareID(square) {
    const [column, row] = square.split("")
    const columnNumber = column.charCodeAt(0) - 96
    return columnNumber + row
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

function test() {
    // const testFEN = "rn3rk1/pppP2p1/7p/2bnpp2/7q/2NP1BP1/PPP4P/R1B1K1NR/ w"
    // const testMoves = "d7d8q f8f7"
    // clearBoard()
    // startPuzzle(testFEN)
    // puzzleAutoMove(testMoves.split(" ")[0])
}