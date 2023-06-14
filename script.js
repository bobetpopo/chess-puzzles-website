let fenHolder = ""

function render(fen) {
    fenHolder += fen
    // sorted array of all row html items
    
    let currentSquare = 1
    let currentRow = 8
    let currentEl
    for (let i = 0; i < fenHolder.length; i++) {
        currentEl = document.querySelector(`#row${currentRow} div:nth-child(${currentSquare})`)
        if (isNaN(fenHolder[i]) && fenHolder[i] !== "/") {
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
            }
            currentSquare++
        } else if (!isNaN(fenHolder[i])) {
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
                // its white's turn
            } else {
                // its black's turn
            }
        }
    }
    fenHolder = ""
}

const startPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
function startGame() {

    render("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1")
}

startGame()

