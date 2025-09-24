import express from "express"
import ViteExpress from "vite-express"

const app = express()

app.use(express.json())

type Player = 'X' | 'O'
type Cell = Player | null
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
type GameState = {
    currentPlayer: Player;
    winner: Player | null | 'draw';
    board: Board;
}

export const initialState: GameState = {
    currentPlayer: 'X',
    winner: null,
    board: [null, null, null, null, null, null, null, null, null]
}

let gameState = initialState

function makeMove(prev: GameState, index: number) {
    const newState = structuredClone(prev)
    const winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

    //add symbol to the cell + switch current player
    if (prev.board[index] === null) {
        newState.board[index] = prev.currentPlayer
        newState.currentPlayer = prev.currentPlayer === 'X' ? 'O' : 'X'
    }

    //win check
    for (let i = 0; i < winCombos.length; i++) {
        const [a, b, c] = winCombos[i]
        if (newState.board[a] === newState.board[b] && newState.board[a] === newState.board[c] && newState.board[a] != null) {
                newState.winner = prev.currentPlayer
        }
    }

    //draw check
    const boardFilled = newState.board.every(val => val != null)
    if (boardFilled && newState.winner === null) {
         newState.winner = 'draw'
    }

    return newState  
}

app.get("/game", (_, res) => {
  res.json(gameState)
})

app.post("/game/move", (req, res) => {
  const {index} = req.body
  gameState = makeMove(gameState, index)
  res.json(gameState)
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
)
