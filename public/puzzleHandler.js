function randomPuzzle() {
    try {
        axios.get("http://localhost:3000/random-puzzle")
            .then((res) => {
                const puzzle = res.data

                const { FEN, Moves } = puzzle
                console.log(FEN)
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


function puzzleAutoMove(move) {
    setTimeout(() => {
        const start = document.getElementById(getSquareID(move.slice(0, 2)))

        const end = document.getElementById(getSquareID(move.slice(2, 4)))

        // if there is a promotion: select piece
        const promotionPiece = move.charAt(4) ? string.charAt(4) : ""
        console.log(promotionPiece)
        
        
        if (start.firstChild) {
            start.firstChild.click()
        }
        if (end.firstChild) {
            end.firstChild.click()
        } else {
            end.click()
        }
    }, 1000)
}

function getSquareID(square) {
    const [column, row] = square.split("")
    const columnNumber = column.charCodeAt(0) - 96
    return columnNumber + row
}

function startPuzzle(FEN) {
    startGame(FEN)
    document.getElementById("reset-btn").disabled = true
}
