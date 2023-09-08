const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"


// start game
startGame(startPos)
function startGame(fen) {
    render(fen)
    addPieceEventListener()
    displayTurn()
    logFEN()
}

function clearBoard() {
    clearValidMoves()
    squares.forEach(square => {
        square.innerHTML = ""
        square.removeEventListener("click", movePiece)
    })
    removeCheckIndicator()
    removeMoveIndicator()
}

function resetGame() {
    clearBoard()
    startGame(startPos)
    clearMoveLog()
}

function render(fen) {
    const params = fen.split(" ")
    const pieceDisposition = params[0]
    const activeColor = params[1]
    const castlingRights = params[2]
    const possibleEnPassantTarget = params[3]
    const halfMoveClock = params[4]

    let currentSquare = 1
    let currentRow = 8
    let currentEl

    // placing pieces
    for (let i = 0; i < pieceDisposition.length; i++) {
        currentEl = document.querySelector(`#row${ currentRow } div:nth-child(${ currentSquare })`)
        if (isNaN(pieceDisposition[i])) {
            switch (pieceDisposition[i]) {
                case "p":
                    currentEl.innerHTML += `<div class="piece black pawn"></div>`
                    break
                case "r":
                    currentEl.innerHTML += `<div class="piece black rook"></div>`
                    break
                case "n":
                    currentEl.innerHTML += `<div class="piece black knight"></div>`
                    break
                case "b":
                    currentEl.innerHTML += `<div class="piece black bishop"></div>`
                    break
                case "q":
                    currentEl.innerHTML += `<div class="piece black queen"></div>`
                    break
                case "k":
                    currentEl.innerHTML += `<div class="piece black king"></div>`
                    break
                case "P":
                    currentEl.innerHTML += `<div class="piece white pawn"></div>`
                    break
                case "R":
                    currentEl.innerHTML += `<div class="piece white rook"></div>`
                    break
                case "N":
                    currentEl.innerHTML += `<div class="piece white knight"></div>`
                    break
                case "B":
                    currentEl.innerHTML += `<div class="piece white bishop"></div>`
                    break
                case "Q":
                    currentEl.innerHTML += `<div class="piece white queen"></div>`
                    break
                case "K":
                    currentEl.innerHTML += `<div class="piece white king"></div>`
                    break
                case "/":
                    currentRow--
                    currentSquare = 0
                    break
                default: break
            }
            currentSquare++
        } else {
            currentSquare += parseInt(pieceDisposition[i])
        }
    }
    // set turn
    currentPlayer = activeColor === "w" ? "white" : "black"
}

const squares = document.querySelectorAll(".square")



