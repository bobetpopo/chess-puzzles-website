// const moveSound = new Audio('sounds/move-self.mp3')
// const captureSound = new Audio('sounds/capture.mp3')
let currentPlayer

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

// select piece
let currentPiece
let validMovesId
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

        // get valid moves based on in check or not
        validMovesId = isInCheck(currentPlayer) ? getValidMovesInCheck(currentPiece) : getValidPieceMoves(currentPiece)
        // add castling valid squares
        if (currentPiece.classList.contains("king")) {
            addCastlingSquares(currentPiece)
        }
        // add en passant valid squares
        if (currentPiece.classList.contains("pawn")) {
            addEnPassantSquares(currentPiece)
        }
        // remove any moves that could expose king
        for (let i = 0; i < validMovesId.length; i++) {
            if ((!stopsCheck(currentPiece, validMovesId[i]))) {
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

        // enable moving
        squares.forEach(square => {
            square.addEventListener("click", movePiece)
        })
    }
}

function movePiece(event) {
    if (currentPiece !== null && isCurrentPlayerPiece(currentPiece)) {
        const targetSquare = event.currentTarget
        const targetPiece = targetSquare.firstChild
        const currentSquare = currentPiece.parentElement
        const isValid = validMovesId.includes(targetSquare.id)

        // if move valid
        if (isValid && (!targetPiece || isOpponentPiece(currentPiece, targetPiece))) {
            // move log param
            let isCapture = false

            // capturing
            let storedTargetPiece
            if (targetPiece) {
                storedTargetPiece = targetPiece
                targetSquare.removeChild(targetPiece)
                // captureSound.play()
                isCapture = true
            }
            // remove en passant target class if any pawn had the class
            clearEnPassantTargets()
            //check for pawn promotion & en passant
            let addPieceToSquare = true
            if (currentPiece.classList.contains("pawn")) {
                const promotionRow = currentPlayer === "white" ? "8" : "1"
                const targetRow = targetSquare.id.charAt(1)
                const currentRow = currentSquare.id.charAt(1)

                if (targetRow === promotionRow) {
                    promotePawn(currentSquare, targetSquare)
                    addPieceToSquare = false
                } else if (currentRow - targetRow === 2 || currentRow - targetRow === -2) {
                    currentPiece.classList.add("enPassantTarget")
                } else if (!storedTargetPiece && isEnPassant(currentSquare, targetSquare)) {
                    enPassantCapture(targetSquare)
                    // captureSound.play()
                    isCapture = true
                }
            } else if (currentPiece.classList.contains("king") && isCastleMove(currentPiece, targetSquare)) {
                handleCastle(currentPiece, targetSquare)
            }
            if (addPieceToSquare) {
                targetSquare.appendChild(currentPiece)
                // moveSound.play()
            }

            // update if rook or king has moved
            if ((currentPiece.classList.contains("rook") || currentPiece.classList.contains("king"))
                && !currentPiece.classList.contains("hasMoved")) {
                currentPiece.classList.add("hasMoved")
            }

            currentPiece.classList.remove("selected")
            clearValidMoves()
            changeTurn()
            handleCheck(currentPlayer)
            logMove(currentPiece, currentSquare, targetSquare, isCapture)
            addMoveIndicator(currentSquare, targetSquare)
            // in puzzle mode, every even move is the user's move, validate them
            if (gamemode === "puzzle" && moveNumber % 2 === 0) {
                handlePuzzleMove(currentSquare, targetSquare)
            }
        }
    }
}

// setting turns
function changeTurn() {
    currentPlayer = currentPlayer === "white" ? "black" : "white"
    displayTurn()
}

function displayTurn() {
    turnDisplayer = document.getElementById("turn-displayer-text")
    turnDisplayer.textContent = `${ currentPlayer } to move`

    turnDisplayerDiv = document.getElementById("turn-displayer-div")
    const imgUrl = currentPlayer === "white" ? "whitepieces/Wpawn.png" : "blackpieces/Bpawn.png"
    turnDisplayerDiv.innerHTML = `<img src="${ imgUrl }" alt="${ currentPlayer }-icon" id="turn-displayer-icon"></img>`
}

// show trail for piece that just moved
function addMoveIndicator(currentSquare, targetSquare) {
    removeMoveIndicator()
    currentSquare.classList.add("just-moved")
    targetSquare.classList.add("just-moved")
}

function removeMoveIndicator() {
    squares.forEach(square => {
        square.classList.remove("just-moved")
    })
}

// logic
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
function isPromotionSquare(endSquare) {
    const promotionRow = currentPlayer === "white" ? "8" : "1"
    const targetRow = endSquare.id.charAt(1)

    return promotionRow === targetRow
}

function promotePawn(pawnSquare, promotionSquare) {
    // disable move nav buttons and piece buttons
    disableGameButtons()
    removePieceEventListener()

    document.getElementById("box").style.display = "flex"
    const selectorPieces = document.querySelectorAll(".selector")
    selectorPieces.forEach(piece => {
        // add piece color to display
        currentPlayer === "white" ? piece.classList.add("white") : piece.classList.add("black")

        // store piece info for later
        const pieceType = piece.classList[2]
        const pieceColor = currentPlayer

        piece.addEventListener("click", function () {
            const newPiece = document.createElement("div")
            newPiece.className = `piece ${ pieceColor } ${ pieceType }`

            document.getElementById("box").style.display = "none"
            if (newPiece) {
                promotionSquare.appendChild(newPiece)
            }
            enableGameButtons()
            addPieceEventListener()
            handleCheck(currentPlayer)
            promotionSquare = null
            pawnSquare.innerHTML = ""

            // redo the fen update that happened before a piece was picked by user
            FENLog.pop()
            moveNumber--
            logFEN()
        })
    })

}

// en passant
function addEnPassantSquares(pawn) {
    const currentSquareId = parseInt(pawn.parentElement.id)
    playerDirection = currentPlayer === "white" ? 1 : -1

    const adjacentSquaresPosition = [-10, 10]

    adjacentSquaresPosition.forEach(direction => {
        const targetSquareId = currentSquareId + direction
        const targetSquare = document.getElementById(targetSquareId.toString())
        const targetSquarePiece = targetSquare?.firstChild

        if (targetSquarePiece?.classList.contains("enPassantTarget")) {
            const validMoveId = targetSquareId + playerDirection
            validMovesId.push(validMoveId.toString())
        }
    })
}

function clearEnPassantTargets() {
    const pawns = document.querySelectorAll(".pawn")
    pawns.forEach(pawn => {
        pawn.classList.remove("enPassantTarget")
    })
}

function isEnPassant(pawnSquare, targetSquare) {
    const pawnSquareId = pawnSquare.id
    const targetSquareId = targetSquare.id
    const difference = parseInt(pawnSquareId) - parseInt(targetSquareId)

    if (!targetSquare.firstChild
        && (difference === -9 || difference === 9 || difference === -11 || difference === 11)) {
        return true
    }

    return false
}

function enPassantCapture(targetSquare) {
    const targetSquareId = parseInt(targetSquare.id)
    const adjacentSquareId = currentPlayer === "white" ? targetSquareId - 1 : targetSquareId + 1
    const adjacentSquare = document.getElementById(adjacentSquareId.toString())

    adjacentSquare.innerHTML = ""
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
    const kingSquare = document.querySelector(`.${ player }.king`).parentElement
    kingSquare.style.backgroundColor = "#E31E32"
}

function removeCheckIndicator() {
    const squares = document.querySelectorAll(".square")
    squares.forEach(square => {
        square.style.backgroundColor = null
    })
}

function isInCheck(currentPlayer) {
    const kingSquareId = document.querySelector(`.${ currentPlayer }.king`).parentElement.id
    const opponent = currentPlayer === "white" ? "black" : "white"

    const opponentPieces = document.querySelectorAll(`.piece.${ opponent }`)
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

    // en passant case 
    let targetSquareId
    let adjacentSquareId
    let adjacentSquare
    const enPassantCase = piece.classList.contains("pawn") && isEnPassant(piece.parentElement, targetSquare)

    if (enPassantCase) {
        targetSquareId = parseInt(targetSquare.id)
        adjacentSquareId = currentPlayer === "white" ? targetSquareId - 1 : targetSquareId + 1
        adjacentSquare = document.getElementById(adjacentSquareId.toString())
        adjacentPiece = adjacentSquare.firstChild

        adjacentSquare.innerHTML = ""
    } else if (targetPiece) {
        targetSquare.removeChild(targetPiece)
    }

    targetSquare.appendChild(piece)

    if (!isInCheck(currentPlayer)) {
        // avoids check
        if (targetPiece) {
            targetSquare.appendChild(targetPiece)
        } else if (enPassantCase) {
            adjacentSquare.appendChild(adjacentPiece)
        }
        currentSquare.appendChild(piece)
        return true
    } else {
        if (targetPiece) {
            targetSquare.appendChild(targetPiece)
        } else if (enPassantCase) {
            adjacentSquare.appendChild(adjacentPiece)
        }
        currentSquare.appendChild(piece)
        return false
    }
}

function isCheckmate(player) {
    const pieces = document.querySelectorAll(`.${ player }.piece`)
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

// castling
function addCastlingSquares(king) {
    if (currentPlayer === "white") {
        if (kingSideCastleOk(king)) validMovesId.push("71")
        if (queenSideCastleOk(king)) validMovesId.push("31")
    } else {
        if (kingSideCastleOk(king)) validMovesId.push("78")
        if (queenSideCastleOk(king)) validMovesId.push("38")
    }
}

function kingSideCastleOk(king) {
    const kingSquare = king.parentElement
    if ((currentPlayer === "white" && kingSquare.id !== "51")
        || (currentPlayer === "black" && kingSquare.id !== "58")) {
        return false
    }

    const rookSquareId = (parseInt(kingSquare.id) + 30).toString()
    const rookSquare = document.getElementById(rookSquareId)
    const rook = rookSquare.firstChild
    const rookTargetSquareId = (parseInt(kingSquare.id) + 10).toString()

    if (rook?.classList.contains("rook")
        && getValidPieceMoves(rook).includes(rookTargetSquareId)
        && !king.classList.contains("hasMoved") && !rook.classList.contains("hasMoved")
        && !isInCheck(currentPlayer)
        && !isCastleBlocked(kingSideCastleOk, king)) {

        return true
    }

    return false
}

function queenSideCastleOk(king) {
    const kingSquare = king.parentElement
    if ((currentPlayer === "white" && kingSquare.id !== "51")
        || (currentPlayer === "black" && kingSquare.id !== "58")) {
        return false
    }

    const rookSquareId = (parseInt(kingSquare.id) - 40).toString()
    const rookSquare = document.getElementById(rookSquareId)
    const rook = rookSquare.firstChild
    const rookTargetSquareId = (parseInt(kingSquare.id) - 10).toString()

    if (rook?.classList.contains("rook")
        && getValidPieceMoves(rook).includes(rookTargetSquareId)
        && !king.classList.contains("hasMoved") && !rook.classList.contains("hasMoved")
        && !isInCheck(currentPlayer)
        && !isCastleBlocked(queenSideCastleOk, king)) {

        return true
    }

    return false
}

function isCastleBlocked(side, king) {
    const kingSquare = king.parentElement
    const kRookTargetSquareId = (parseInt(kingSquare.id) + 10).toString()
    const qRookTargetSquareId = (parseInt(kingSquare.id) - 10).toString()

    if (side === kingSideCastleOk) {
        return !stopsCheck(king, kRookTargetSquareId)
    } else {
        return !stopsCheck(king, qRookTargetSquareId)
    }
}

function isCastleMove(king, targetSquare) {
    const kingSquareId = king.parentElement.id
    const targetSquareId = targetSquare.id
    const difference = parseInt(targetSquareId) - parseInt(kingSquareId)

    if (difference === 20) {
        return "kingside"
    } else if (difference === -20) {
        return "queenside"
    }
    return ""
}

function handleCastle(king, targetSquare) {
    const kingSquareId = king.parentElement.id
    const targetSquareId = targetSquare.id
    const difference = parseInt(targetSquareId) - parseInt(kingSquareId)

    let rookSquareId, rookTargetSquareId
    if (difference === 20) {
        rookSquareId = (parseInt(kingSquareId) + 30).toString()
        rookTargetSquareId = (parseInt(kingSquareId) + 10).toString()
    } else if (difference === -20) {
        rookSquareId = (parseInt(kingSquareId) - 40).toString()
        rookTargetSquareId = (parseInt(kingSquareId) - 10).toString()
    }

    const rookSquare = document.getElementById(rookSquareId)
    const rook = rookSquare.firstChild
    document.getElementById(rookTargetSquareId).appendChild(rook)
}

function endGame() {
    const winner = currentPlayer === "white" ? "Black" : "White"
    removePieceEventListener()

    //update turn displayer to display win message
    document.getElementById("turn-displayer-text").textContent = `${ winner } wins!`
    turnDisplayerDiv = document.getElementById("turn-displayer-div")
    const imgUrl = winner === "White" ? "whitepieces/Wking.png" : "blackpieces/Bking.png"
    turnDisplayerDiv.innerHTML = `<img src="${ imgUrl }" alt="${ winner }-icon" id="turn-displayer-icon"></img>`
}
