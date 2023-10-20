const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
const squares = document.querySelectorAll(".square")
const modebtns = document.querySelectorAll(".mode-select")
const [freePlay, playPuzzles] = modebtns
let gamemode

function freePlayMode() {
    // update mode highlighting
    playPuzzles.classList.remove("current-mode")
    freePlay.classList.add("current-mode")
    gamemode = "freeplay"

    // if puzzle end screen is up, take it down
    if (document.getElementById("move-display-container").classList.contains("half-container")) {
        clearPuzzleScreen()
    }
    clearBoard()
    clearMoveLog()
    startGame(startPos)

    // disable next puzzle button
    document.getElementById("random-btn").disabled = true
    document.getElementById("reset-btn").disabled = false
}

function puzzleMode() {
    freePlay.classList.remove("current-mode")
    playPuzzles.classList.add("current-mode")
    gamemode = "puzzle"

    randomPuzzle()
}

// start game, in freeplay by default
freePlayMode()

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

function flipBoard() {
    const board = document.getElementById("chessboard")
    board.classList.toggle("flipped")
    const pieces = document.querySelectorAll(".piece")
    pieces.forEach(piece => {
        piece.classList.toggle("flipped")
    })
}

function flipBoardIfNeeded() {
    const board = document.getElementById("chessboard")
    if (board.classList.contains("flipped")) {
        flipBoard()
        return "flipped board"
    } else {
        return "no flip"
    }
}

function resetGame() {
    clearBoard()
    clearMoveLog()
    startGame(startPos)
}

function render(fen) {
    // flip board before render if is flipped
    const flip = flipBoardIfNeeded()

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
    // flip board back if it was flipped for render
    flip === "flipped board" ? flipBoard() : null
}

function disableGameButtons() {
    const gameButtons = document.querySelectorAll(".game-btn") 
    gameButtons.forEach(button => {
        button.disabled = true
    })
    const modeSelectButtons = document.querySelectorAll(".mode-select")
    modeSelectButtons.forEach(button => {
        button.disabled = true
    })
    document.onkeydown = null
}

function enableGameButtons() {
    const gameButtons = document.querySelectorAll(".game-btn") 
    gameButtons.forEach(button => {
        button.disabled = false
    })
    const modeSelectButtons = document.querySelectorAll(".mode-select")
    modeSelectButtons.forEach(button => {
        button.disabled = false
    })
    enableArrowMoving()
}
