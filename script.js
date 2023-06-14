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
                    currentEl.innerHTML += `<div class="piece bpawn"></div>`
                    break
                case "r":
                    currentEl.innerHTML += `<div class="piece brook"></div>`
                    break
                case "n":
                    currentEl.innerHTML += `<div class="piece bknight"></div>`
                    break
                case "b":
                    currentEl.innerHTML += `<div class="piece bbishop"></div>`
                    break
                case "q":
                    currentEl.innerHTML += `<div class="piece bqueen"></div>`
                    break
                case "k":
                    currentEl.innerHTML += `<div class="piece bking"></div>`
                    break
                case "P":
                    currentEl.innerHTML += `<div class="piece wpawn"></div>`
                    break
                case "R":
                    currentEl.innerHTML += `<div class="piece wrook"></div>`
                    break
                case "N":
                    currentEl.innerHTML += `<div class="piece wknight"></div>`
                    break
                case "B":
                    currentEl.innerHTML += `<div class="piece wbishop"></div>`
                    break
                case "Q":
                    currentEl.innerHTML += `<div class="piece wqueen"></div>`
                    break
                case "K":
                    currentEl.innerHTML += `<div class="piece wking"></div>`
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
            if (fenHolder[i+1] === "w") {
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
    document.getElementById("turnDisplayer").textContent = `It is ${currentPlayer}'s turn`
}

startGame()

// move pieces
// select piece
const pieces = document.querySelectorAll(".piece")
pieces.forEach(piece => {
    piece.addEventListener("click", selectPiece)
})

function selectPiece(event) {
    const selectedPiece = event.target
    const selectedPieces = document.querySelectorAll(".selected")
    selectedPieces.forEach(piece => {
        piece.classList.remove("selected")
    })
    if (isCurrentPlayerPiece(selectedPiece)) {
        selectedPiece.classList.add("selected")
    }
}

// select square to move to
const squares = document.querySelectorAll(".square")
squares.forEach(square => {
    square.addEventListener("click", movePiece)
})

function movePiece(event) {
    const selectedPiece = document.querySelector(".selected")
    if (isCurrentPlayerPiece(selectedPiece)) {
        const targetSquare = event.target
        // add if move valid
        targetSquare.appendChild(selectedPiece)
        selectedPiece.classList.remove("selected")
        changeTurn()
        document.getElementById("turnDisplayer").textContent = `It is ${currentPlayer}'s turn`
    }
}

// setting turns


function changeTurn() {
    currentPlayer = currentPlayer === "white" ? "black" : "white"
}

function isCurrentPlayerPiece(piece) {
    let pieceColor
    const whitePieces = ["wrook", "wknight", "wpawn", "wbishop", "wqueen", "wking"]
    if (whitePieces.some(pieceName => piece.classList.contains(pieceName))) {
        pieceColor = "white"
    } else {
        pieceColor = "black"
    }
    return pieceColor === currentPlayer
}