let fenHolder = ""
let currentPlayer
// const moveSound = new Audio('sounds/move-self.mp3')
// const captureSound = new Audio('sounds/capture.mp3')
document.getElementById("turnDisplayer").addEventListener("click", function() {
    console.log(isInCheck(currentPlayer))
})

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
    clearValidMoves()
    squares.forEach(square => {
        square.innerHTML = ""
        square.removeEventListener("click", movePiece)
    })
    startGame()
    removeCheckIndicator()
}

// move pieces
// select piece
function addPieceEventListener() {
    const pieces = document.querySelectorAll(".piece")
    pieces.forEach(piece => {
        piece.addEventListener("click", selectPiece)
    })
}

function removePieceEventListener() {
    const pieces = document.querySelectorAll(".piece")
    pieces.forEach(piece => {
        piece.removeEventListener("click", selectPiece)
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
        clearValidMoves()

        let validMovesId
        validMovesId = isInCheck(currentPlayer) ? getValidMovesInCheck(currentPiece) : getValidPieceMoves(currentPiece)
        for (let i = 0; i < validMovesId.length; i++) {
            if ((exposesKing(currentPiece, validMovesId[i]))) {
                validMovesId.splice(i, 1)
                i--
            }
        }

        let validMoves = []
        validMovesId.forEach(id => {
            validMoves.push(document.getElementById(id))
        })

        validMoves.forEach(square => {
            square.classList.add("valid-target-square")
        })
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

            // checks
            const validMovesId = isInCheck(currentPlayer) ? getValidMovesInCheck(currentPiece) : getValidPieceMoves(currentPiece)
            // pins
            for (let i = 0; i < validMovesId.length; i++) {
                if ((exposesKing(currentPiece, validMovesId[i]))) {
                    validMovesId.splice(i, 1)
                    i--
                }
            }
            const isValid = validMovesId.includes(targetSquare.id)
            // if move valid
            if (isValid && (!pieceInTarget || isOpponentPiece(currentPiece, pieceInTarget))) {
                if (pieceInTarget) {
                    targetSquare.removeChild(pieceInTarget)
                    // captureSound.play()
                }
                //check for pawn promotion
                if (currentPiece.classList.contains("pawn")) {
                    const promotionRow = currentPlayer === "white" ? "8" : "1"
                    const targetRow = targetSquare.id.charAt(1)
                    if (targetRow === promotionRow) {
                        promotePawn(targetSquare)
                        currentPiece.parentElement.innerHTML = ""
                    } else {
                        targetSquare.appendChild(currentPiece)
                        // moveSound.play()
                    }
                } else {
                    // for all other pieces
                    targetSquare.appendChild(currentPiece)
                    // moveSound.play()
                }
                currentPiece.classList.remove("selected")
   
                clearValidMoves()
                changeTurn()
                document.getElementById("turnDisplayer").textContent = `It is ${currentPlayer}'s turn`
                handleCheck(currentPlayer)
            }
        }
    }
}

// setting turns
function changeTurn() {
    currentPlayer = currentPlayer === "white" ? "black" : "white"
}


function isCurrentPlayerPiece(piece) {
    const pieceColor = piece.classList.contains("white") ? "white" : "black"
    return pieceColor === currentPlayer
}

function isOpponentPiece(piece1, piece2) {
    const isPiece1White = piece1.classList.contains("white")
    const isPiece2White = piece2.classList.contains("white")

    return isPiece1White !== isPiece2White
}

// move validation
function clearValidMoves() {
    squares.forEach(square => {
        square.classList.remove("valid-target-square")
    })
}

function getValidPieceMoves(piece) {
    if (piece.classList.contains("pawn")) {
        return getValidPawnMoves(piece)
    } else if (piece.classList.contains("knight")) {
        return getValidKnightMoves(piece)
    } else if (piece.classList.contains("rook")) {
        return getValidRookMoves(piece)
    } else if (piece.classList.contains("bishop")) {
        return getValidBishopMoves(piece)
    } else if (piece.classList.contains("queen")) {
        return getValidRookMoves(piece).concat(getValidBishopMoves(piece))
    } else if (piece.classList.contains("king")) {
        return getValidKingMoves(piece)
    }

}

function getValidPawnMoves(piece) {
    let validMoves = []
    const isPieceWhite = piece.classList.contains("white")

    const move = isPieceWhite ? 1 : -1
    const capture = isPieceWhite ? [-9, 11] : [-11, 9]

    const currentSquareId = piece.parentElement.id
    const targetSquareId = parseInt(currentSquareId) + move
    if (!document.getElementById(targetSquareId).firstChild) {
        validMoves.push(targetSquareId.toString())

        const currentRow = currentSquareId.charAt(1)
        if (((!isPieceWhite && currentRow == "7") || (isPieceWhite && currentRow === "2"))
            && !document.getElementById(targetSquareId + move).firstChild) {
            validMoves.push((targetSquareId + move).toString())
        }

    }

    const captureSquaresIds = [
        parseInt(currentSquareId) + parseInt(capture[0]),
        parseInt(currentSquareId) + parseInt(capture[1])
    ]

    for (let i = 0; i < captureSquaresIds.length; i++) {
        const captureSquaresId = document.getElementById(captureSquaresIds[i])
        if (captureSquaresId && captureSquaresId.firstChild && isOpponentPiece(piece, captureSquaresId.firstChild)) {

            validMoves.push(captureSquaresIds[i].toString())
        }
    }

    
    return validMoves
}

function getValidKnightMoves(piece) {
    let validMoves = []
    const moves = [-8, -19, -21, -12, 8, 19, 21, 12]
    const currentSquareId = piece.parentElement.id

    // create array with id of valid squares
    let validSquares = getAllValidSquares(currentSquareId, moves)

    validSquares.forEach(square => {
        if (square && (!square.firstChild || isOpponentPiece(piece, square.firstChild))) {
            validMoves.push(square.id)
        }
    })
    return validMoves
}

function getValidRookMoves(piece) {
    let validMoves = []
    const moves = {
        up: [1, 2, 3, 4, 5, 6, 7],
        down: [-1, -2, -3, -4, -5, -6, -7],
        left: [-10, -20, -30, -40, -50, -60, -70],
        right: [10, 20, 30, 40, 50, 60, 70]
    }
    const currentSquareId = piece.parentElement.id

    const validSquares = {
        up: getAllValidSquares(currentSquareId, moves.up),
        down: getAllValidSquares(currentSquareId, moves.down),
        left: getAllValidSquares(currentSquareId, moves.left),
        right: getAllValidSquares(currentSquareId, moves.right)
    }

    const directions = Object.values(validSquares)
    directions.forEach(direction => {
        removeWrongSquares(direction)
        direction.forEach(square => {
            if (square && (!square.firstChild || isOpponentPiece(piece, square.firstChild))) {
                validMoves.push(square.id)
            }
        })
    })

    return validMoves
}

function getValidBishopMoves(piece) {
    let validMoves = []
    const moves = {
        nw: [-9, -18, -27, -36, -45, -54, -63],
        ne: [11, 22, 33, 44, 55, 66, 77],
        se: [9, 18, 27, 36, 45, 54, 63],
        sw: [-11, -22, -33, -44, -55, -66, -77]
    }
    const currentSquareId = piece.parentElement.id

    const validSquares = {
        nw: getAllValidSquares(currentSquareId, moves.nw),
        ne: getAllValidSquares(currentSquareId, moves.ne),
        se: getAllValidSquares(currentSquareId, moves.se),
        sw: getAllValidSquares(currentSquareId, moves.sw)
    }
    
    const directions = Object.values(validSquares)
    directions.forEach(direction => {
        removeWrongSquares(direction)
        direction.forEach(square => {
            if (square && (!square.firstChild || isOpponentPiece(piece, square.firstChild))) {
                validMoves.push(square.id)
            }
        })
    })

    return validMoves
}

function getValidKingMoves(piece) {
    let validMoves = []
    const moves = [-9, 1, 11, 10, 9, -1, -11, -10]
    const currentSquareId = piece.parentElement.id

    let validSquares = getAllValidSquares(currentSquareId, moves)

    validSquares.forEach(square => {
        if (square && (!square.firstChild || isOpponentPiece(piece, square.firstChild))) {
            validMoves.push(square.id)
        }
    })
    return validMoves
}

function getAllValidSquares(currentSquareId, direction) {
    let allValidSquares = []
    direction.forEach(move => {
        const validSquareId = parseInt(currentSquareId) + move
        allValidSquares.push(document.getElementById(validSquareId.toString()))
    })
    return allValidSquares
}

function removeWrongSquares(allValidSquares) {
    for (let i = 0; i < allValidSquares.length; i++) {
        if (allValidSquares[i]) {
            if (allValidSquares[i].firstChild) {
                let squaresToRemove = allValidSquares.length - i - 1
                for (let j = 0; j < squaresToRemove; j++) {
                    allValidSquares.pop()
                }
            }
            continue
        } else {
            let squaresToRemove = allValidSquares.length - i - 1
            for (let j = 0; j < squaresToRemove; j++) {
                allValidSquares.pop()
            }
        }
    }
}

// pawn promotion
function promotePawn(promotionSquare) {
    document.getElementById("box").style.display="flex"
    removePieceEventListener()

    const selectorPieces = document.querySelectorAll(".selector")
    selectorPieces.forEach(piece => {
        piece.classList.remove("white", "black")
        currentPlayer === "white" ? piece.classList.add("white") : piece.classList.add("black")

        piece.addEventListener("click", function() {
            let newPiece = document.createElement("div")
            newPiece.className = piece.className
            newPiece.classList.remove("selector")
            
            document.getElementById("box").style.display="none"
            if (newPiece) {
                promotionSquare.appendChild(newPiece)
            }
            addPieceEventListener()
            promotionSquare = null

            const opponent = currentPlayer === "white" ? "black" : "white"
            if (isInCheck(currentPlayer)) {
                addCheckIndicator(currentPlayer)
            }
        })
    })

    
}

// check logic
function handleCheck(player) {
    if (isInCheck(player)) {
        addCheckIndicator(player)
        if (isCheckmate(player)) {
            endGame()
        }
    } else {
        removeCheckIndicator()
    }
}

function addCheckIndicator(player) {
    const kingSquare = document.querySelector(`.${player}.king`).parentElement
    kingSquare.style.backgroundColor="red"
}

function removeCheckIndicator() {
    const squares = document.querySelectorAll(".square")
    squares.forEach(square => {
        square.style.backgroundColor = null
    })
}

function isInCheck(currentPlayer) {
    const kingSquareId = document.querySelector(`.${currentPlayer}.king`).parentElement.id
    const opponent = currentPlayer === "white" ? "black" : "white"

    const opponentPieces = document.querySelectorAll(`.piece.${opponent}`)
    for (let i = 0; i < opponentPieces.length; i++) {
        const validMoves = getValidPieceMoves(opponentPieces[i])
        if (validMoves.includes(kingSquareId.toString())) {
            return true
        }
    }
    return false
}

function getValidMovesInCheck(piece) {
    let validMovesInCheck = getValidPieceMoves(piece)
    
    for (let i = 0; i < validMovesInCheck.length; i++) {
        if (!stopsCheck(piece, validMovesInCheck[i])) {
            validMovesInCheck.splice(i, 1)
            i--
        }
    }
    
    return validMovesInCheck
}

function stopsCheck(piece, move) {
    const currentSquare = piece.parentElement
    const targetSquare = document.getElementById(move)
    const targetPiece = targetSquare.firstChild

    if (targetPiece) {
        targetSquare.removeChild(targetPiece)
    }

    targetSquare.appendChild(piece)

    if (!isInCheck(currentPlayer)) {
        // avoids check
        if (targetPiece) {
            targetSquare.appendChild(targetPiece)
        }
        currentSquare.appendChild(piece)
        return true
    } else {
        if (targetPiece) {
            targetSquare.appendChild(targetPiece)
        }
        currentSquare.appendChild(piece)
        return false
    }
}

function isCheckmate(player) {
    const pieces = document.querySelectorAll(`.${player}.piece`)
    let allMoves = []
    for (let i = 0; i < pieces.length; i++) {
        const currentPieceMoves = getValidMovesInCheck(pieces[i])
        allMoves = allMoves.concat(currentPieceMoves)
    }
    if (!allMoves[0]) {
        return true
    }    
    return false
}

function exposesKing(piece, move) {
    const currentSquare = piece.parentElement
    const targetSquare = document.getElementById(move)
    const targetPiece = targetSquare.firstChild

    if (targetPiece) {
        targetSquare.removeChild(targetPiece)
    }

    targetSquare.appendChild(piece)

    if (!isInCheck(currentPlayer)) {
        if (targetPiece) {
            targetSquare.appendChild(targetPiece)
        }
        currentSquare.appendChild(piece)
        return false
    } else {
        if (targetPiece) {
            targetSquare.appendChild(targetPiece)
        }
        currentSquare.appendChild(piece)
        return true
    }
}

function endGame() {
    const winner = currentPlayer === "white" ? "Black" : "White"
    removePieceEventListener()
    document.getElementById("turnDisplayer").textContent = `${winner} wins!`
}
