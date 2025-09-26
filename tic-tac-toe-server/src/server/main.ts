import express from "express"
import ViteExpress from "vite-express"
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(express.json())

// structure of game state
type Player = 'X' | 'O'
type Cell = Player | null
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
type GameState = {
    id: string;
    currentPlayer: Player;
    winner: Player | null | 'draw';
    board: Board;
}

// default state of a new anonymous game
const initialState: GameState = {
    id: '',
    currentPlayer: 'X',
    winner: null,
    board: [null, null, null, null, null, null, null, null, null]
}

// game storage
const games = new Map()

// create new game, generate id, add to 'games'
function createGameState() {
  const newGame = {...initialState, id: uuidv4()}
  games.set(newGame.id, newGame)
  return newGame
}

// update game state every move
function makeMove(prev: GameState, index: number, id: string) {
    const newState = structuredClone(prev)
    const winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

    // add symbol to the cell + switch current player
    if (prev.board[index] === null) {
        newState.board[index] = prev.currentPlayer
        newState.currentPlayer = prev.currentPlayer === 'X' ? 'O' : 'X'
    }

    // win check
    for (let i = 0; i < winCombos.length; i++) {
        const [a, b, c] = winCombos[i]
        if (newState.board[a] === newState.board[b] && newState.board[a] === newState.board[c] && newState.board[a] != null) {
                newState.winner = prev.currentPlayer
        }
    }

    // draw check
    const boardFilled = newState.board.every(val => val != null)
    if (boardFilled && newState.winner === null) {
         newState.winner = 'draw'
    }

    // reset
    if (index === 9) {
      newState.currentPlayer = 'X'
      newState.winner = null
      newState.board = [null, null, null, null, null, null, null, null, null]
    }

    games.set(id, newState)
    return newState
}

//hooks

// send back game list
app.get("/games", (_, res) => {
  res.json(Array.from(games.keys()))
})

// create game, send back it's state
app.post("/game/new", (_, res) => {
  res.json(createGameState())
})

// send back a game from the list
app.get("/game/:id", (req, res) => {
  res.json(games.get(req.params.id))
})

// make a move in scecified game
app.post("/game/:id/move", (req, res) => {
  const id = req.params.id
  const {index} = req.body
  res.json(makeMove(games.get(id), index, id))
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
)
