let moveLog = []
let FENLog = []
let moveNumber = -1

function logFEN() {

    const pieceDisposition = getPieceDisposition()
    const activeColor = currentPlayer === "white" ? "w" : "b"

    FENLog.push(`${pieceDisposition} ${activeColor}`)
    moveNumber++
    highlightMove()
}



const pieceFENMap = new Map()
pieceFENMap.set("black rook", "r")
pieceFENMap.set("black knight", "n")
pieceFENMap.set("black bishop", "b")
pieceFENMap.set("black queen", "q")
pieceFENMap.set("black king", "k")
pieceFENMap.set("black pawn", "p")
pieceFENMap.set("white rook", "R")
pieceFENMap.set("white knight", "N")
pieceFENMap.set("white bishop", "B")
pieceFENMap.set("white queen", "Q")
pieceFENMap.set("white king", "K")
pieceFENMap.set("white pawn", "P")

function getPieceDisposition() {
    let pieceDisposition = ""

    let currentCol = 1
    let currentRow = 8
    let currentSquare

    let emptyStreak = 0
    for (let i = 0; i < 64; i++) {
        currentSquare = document.querySelector(`#row${ currentRow } div:nth-child(${ currentCol })`)
  
        // if square has a piece
        if (currentSquare.firstChild) {
            // add number if applicable
            if (emptyStreak !== 0) {
                pieceDisposition += emptyStreak
                emptyStreak = 0
            }
            // add FEN letter of piece
            const pieceClassList = currentSquare.firstChild.classList
            const pieceName = pieceClassList[1] + " " + pieceClassList[2]
            pieceDisposition += pieceFENMap.get(pieceName)
        } else {
            emptyStreak++
        }

        // if end of column
        if (currentCol === 8) {
            if (emptyStreak !== 0) {
                pieceDisposition += emptyStreak
                emptyStreak = 0
            }
            currentCol = 1
            currentRow--
            pieceDisposition += "/"   
        } else {
            currentCol++
        }
    }
    return pieceDisposition
}


function logMove(piece, startSquare, endSquare, isCapture) {
    const isCheck = isInCheck(currentPlayer) ? true : false
    const isMate = isCheckmate(currentPlayer) ? true : false

    const move = {
        piece: piece,
        start: startSquare,
        end: endSquare,
        isCapture: isCapture,
        isCheck: isCheck,
        isMate: isMate
    }

    moveLog.push(move)
    displayMoveLog()
    logFEN()
}

function displayMoveLog() {
    const displayNum = getDisplayNum()
    // const carriageReturn = displayNum === "" ? "" : "\r\n"

    const moveNumDisplayer = document.getElementById("move-num-displayer")
    const moveTextfieldWhite = document.getElementById("move-textfield-white")
    const moveTextfieldBlack = document.getElementById("move-textfield-black")

    const lastMove = moveLog[moveLog.length - 1]
    const pieceLetter = getPieceLetter(lastMove.piece, lastMove.isCapture, lastMove.start)
    const endSquare = getEndSquare(lastMove.end.id)
    const captureSign = lastMove.isCapture ? "x" : ""
    const mateSign = lastMove.isMate ? "#" : ""
    const checkSign = !mateSign && lastMove.isCheck ? "+" : ""


    let moveInnerText = `${ pieceLetter }${ captureSign }${ endSquare }${ checkSign }${ mateSign }`

    // castle moves, logic flipped
    if (handleCastleMove(lastMove.piece, lastMove.start) === "kingside") {
        moveInnerText = `O-O-O${ checkSign }${ mateSign }`
    } else if (handleCastleMove(lastMove.piece, lastMove.start) === "queenside") {
        moveInnerText = `O-O${ checkSign }${ mateSign }`
    }
    const moveText = document.createElement("p")
    moveText.textContent = moveInnerText
    moveText.classList.add("move-text")
    moveText.id = `move${moveNumber}`

    if (displayNum) {
        moveNumDisplayer.appendChild(displayNum)
    }
    
    if (currentPlayer === "black") {
        moveTextfieldWhite.appendChild(moveText)
    } else {
        if (displayNum.textContent === "1.") {
            moveTextfieldWhite.innerHTML = "<p class='move-text'>...</p>"
            moveLog.unshift("...")
        }
        moveTextfieldBlack.appendChild(moveText)
    }
}

function clearMoveLog() {
    moveLog = []
    document.getElementById("move-num-displayer").textContent = ""
    document.getElementById("move-textfield-white").textContent = ""
    document.getElementById("move-textfield-black").textContent = ""
    resetFENLog()
}

function resetFENLog() {
    moveNumber = -1
    FENLog = []
}

const pieceLetterMap = new Map()
pieceLetterMap.set("knight", "N")
pieceLetterMap.set("rook", "R")
pieceLetterMap.set("bishop", "B")
pieceLetterMap.set("king", "K")
pieceLetterMap.set("queen", "Q")

function getPieceLetter(piece, isCapture, startSquare) {
    const pieceName = piece.classList[2]
    if (piece.classList.contains("pawn")) {
        if (isCapture) {
            const [column] = startSquare.id.split("")

            return String.fromCharCode(96 + parseInt(column))
        } else {
            return ""
        }
    } else {
        return pieceLetterMap.get(pieceName)
    }
}

function getEndSquare(square) {
    const [column, row] = square.split("")
    const columnChar = String.fromCharCode(96 + parseInt(column))

    return columnChar + row
}

function getDisplayNum() {
    // OLD
    // if (moveLog.length % 2 === 0) {
    //     return ""
    // } else {
    //     return Math.floor((moveLog.length + 1) / 2) + "."
    // }
    if (moveLog.length % 2 === 0) {
        return ""
    } else {
        const displayNum = Math.floor((moveLog.length + 1) / 2)
        const moveNum = document.createElement("p")
        moveNum.textContent = `${displayNum}.`
        moveNum.classList.add("move-number")
        moveNum.id = `num${displayNum}`

        return moveNum
    }
}

function handleCastleMove(piece, endSquare) {
    if (piece.classList.contains("king")) {
        return isCastleMove(piece, endSquare)
    }
}

function rewindMove() {
    if (moveNumber > 0) {
        moveNumber--
        clearBoard()
        render(FENLog[moveNumber])
        highlightMove()
    }
}

function nextMove() {
    if (moveNumber < FENLog.length - 1) {
        moveNumber++
        clearBoard()
        render(FENLog[moveNumber])

        if (moveNumber === FENLog.length - 1) {
            addPieceEventListener()
        }
        highlightMove()
    }
}

function highlightMove() {
    const highlightedMove = document.getElementById(`move${moveNumber - 1}`)
    if (highlightedMove) {
        removehighlights()
        highlightedMove.classList.add("highlighted-move")

    } else {
        // highlightedMove is null when rewinding the first move
        removehighlights()
    }
}

function removehighlights() {
    const moves = document.querySelectorAll(".move-text")
    moves.forEach(move => {
        move.classList.remove("highlighted-move")
    })
}