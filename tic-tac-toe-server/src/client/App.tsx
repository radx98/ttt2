import { useState } from 'react'
import './App.css'
import {type GameState, initialState, makeMove} from './tictactoe'

export default function App() {
  const [gameState, setGameState] = useState<GameState>(initialState)

  function showStatus() {
    if (gameState.winner != null && gameState.winner != 'draw') {
      return `${gameState.winner} won!`
    } else if (gameState.winner === 'draw') {
      return "That's a draw :("
    } else {
      return `${gameState.currentPlayer}'s turn...`
    }
  }

  function cellClicked(index: number) {
    setGameState(makeMove(gameState, index))
  }

  return <>
    <h1>TIC-TAC-TOE</h1>
    <h3>{showStatus()}</h3>
    <div className='grid'>
      {gameState.board.map((cell, index) =>
        <button key={index} onClick={() => cellClicked(index)}>
          {cell}
        </button>)}
    </div>
  </>
}