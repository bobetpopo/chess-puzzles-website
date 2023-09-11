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
    const testFEN = "r1bq1rk1/1pp2pp1/p1np1n1p/4p3/2B1P3/2NPPN2/PPP1Q1PP/R4RK1/ w"
    clearBoard()
    clearMoveLog()
    startGame(testFEN)
}