function randomPuzzle() {
    try {
        axios.get("http://localhost:3000/random-puzzle")
            .then((res) => {
                const puzzle = res.data
                console.log("response:", puzzle)

                const { FEN, Moves } = puzzle
                console.log(FEN)
                console.log(Moves)

                clearBoard()
                startGame(FEN)
            })
            .catch(err => {
                console.log("ERROR!")
                console.log(err)
            })
    } catch (err) {
        console.log(err)
    }
}

