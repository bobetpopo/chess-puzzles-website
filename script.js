let fenHolder = ""
let currentPlayer

function render(fen) {
    fenHolder += fen

    let currentSquare = 1
    let currentRow = 8
    let currentEl
    for (let i = 0; i < fenHolder.length; i++) {
        currentEl = document.querySelector(`#row${currentRow} div:nth-child(${currentSquare})`)
        if (isNaN(fenHolder[i]) && fenHolder[i] !== "/" && fenHolder[i] != " ") {
            switch (fenHolder[i]) {
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
                default:
                    break
            }
            currentSquare++
        } else if (!isNaN(fenHolder[i]) && fenHolder[i] != " ") {
            // if number
            currentSquare += parseInt(fenHolder[i])
            continue
        } else if (fenHolder[i] === "/") {
            currentRow--
            currentSquare = 1
            continue
            // move to next row
        } else if (fenHolder[i] === " ") {
            if (fenHolder[i + 1] === "w") {
                currentPlayer = "white"
                break
            } else {
                currentPlayer = "black"
                break
            }
        }
    }
    fenHolder = ""
}

// start game

const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"
function startGame() {
    render(startPos)
    addPieceEventListener()
    document.getElementById("turnDisplayer").textContent = `It is ${currentPlayer}'s turn`
}
startGame()

const squares = document.querySelectorAll(".square")

function resetGame() {
    squares.forEach(square => {
        square.innerHTML = ""
        square.removeEventListener("click", movePiece)
    })
    startGame()
}

// move pieces
// select piece
function addPieceEventListener() {
    const pieces = document.querySelectorAll(".piece")
    pieces.forEach(piece => {
        piece.addEventListener("click", selectPiece)
    })    
}

let currentPiece

function selectPiece(event) {
    const selectedPiece = event.target
    const otherPieces = document.querySelectorAll(".selected")
    otherPieces.forEach(piece => {
        piece.classList.remove("selected")
    })
    if (isCurrentPlayerPiece(selectedPiece)) {
        selectedPiece.classList.add("selected")
        currentPiece = selectedPiece
    }

    squares.forEach(square => {
        square.addEventListener("click", movePiece)
    })

}

function movePiece(event) {
    if (currentPiece !== null && isCurrentPlayerPiece(currentPiece)) {
        const targetSquare = event.currentTarget
        
        if (targetSquare.classList.contains("square")) {
            const pieceInTarget = targetSquare.firstChild
            // if move valid
            if (!pieceInTarget || isOpponentPiece(currentPiece, pieceInTarget)) {
                if (pieceInTarget) {
                    targetSquare.removeChild(pieceInTarget)
                }

                targetSquare.appendChild(currentPiece)
                currentPiece.classList.remove("selected")
                currentPiece = null

                changeTurn()
                document.getElementById("turnDisplayer").textContent = `It is ${currentPlayer}'s turn`
            }
        }
    }
}

// setting turns
function changeTurn() {
    currentPlayer = currentPlayer === "white" ? "black" : "white"
}


function isCurrentPlayerPiece(piece) {
    let pieceColor
    pieceColor = piece.classList.contains("white") ? "white" : "black"
    return pieceColor === currentPlayer
}

function isOpponentPiece(piece1, piece2) {
    let isPiece1White = piece1.classList.contains("white") ? true : false
    let isPiece2White = piece2.classList.contains("white") ? true : false

    return isPiece1White !== isPiece2White
}