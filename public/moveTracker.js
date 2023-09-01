let moveLog = []

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
}

function displayMoveLog() {
    const displayNum = getDisplayNum()
    const carriageReturn = displayNum.length !== 0 ? "" : "\r\n"

    const moveNumDisplayer = document.getElementById("move-num-displayer")
    const moveTextfieldWhite = document.getElementById("move-textfield-white")
    const moveTextfieldBlack = document.getElementById("move-textfield-black")
    const lastMove = moveLog[moveLog.length - 1]

    const pieceLetter = getPieceLetter(lastMove.piece, lastMove.isCapture, lastMove.start)
    const endSquare = getEndSquare(lastMove.end)
    const captureSign = lastMove.isCapture ? "x" : ""
    const checkSign = lastMove.isCheck ? "+" : ""

    const moveText = `${ pieceLetter }${ captureSign }${ endSquare }${ checkSign } \r\n`
    moveNumDisplayer.textContent += `${ displayNum }${ carriageReturn }`

    if (currentPlayer === "black") {
        console.log(moveTextfieldWhite)
        moveTextfieldWhite.textContent += moveText
    } else {
        moveTextfieldBlack.textContent += moveText
    }
    // moveDisplayerDiv.textContent += `${ pieceLetter }${ captureSign }${ endSquare }${ checkSign }${ carriageReturn }`

}

function clearMoveLog() {
    moveLog = []
    document.getElementById("move-num-displayer").textContent = ""
    document.getElementById("move-textfield-white").textContent = ""
    document.getElementById("move-textfield-black").textContent = ""
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
    const squareId = square.id
    const [column, row] = squareId.split("")
    const columnChar = String.fromCharCode(96 + parseInt(column))

    return columnChar + row
}

function getDisplayNum() {
    // return Math.floor((moveLog.length + 1) / 2)
    if (moveLog.length % 2 === 0) {
        return ""
    } else {
        return Math.floor((moveLog.length + 1) / 2) + "."
    }
}

