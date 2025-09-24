import { useState } from 'react'
import './App.css'
import {type GameState} from './tictactoe'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'

export default function App() {
  // const [gameState, setGameState] = useState<GameState>(initialState)

  // function cellClicked(index: number) {
  //   if (gameState.winner === null) {
  //     setGameState(makeMove(gameState, index))
  //   }
  // }

  const queryClient = useQueryClient()
  const {data: gameState, isLoading} = useQuery({
    queryKey: ['game'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/game')
      if (!res.ok) throw new Error('Failed to fetch game')
      return res.json()
    }
  })

  const {mutate} = useMutation({mutationFn: async (index: number) => {
    await fetch("/game/move", {  
      method: "POST",  
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify({ index })
    })
  }, onSuccess: () => queryClient.invalidateQueries({queryKey: ["game"]}) })

  function showStatus() {
    if (gameState.winner != null && gameState.winner != 'draw') {
      return `${gameState.winner} won!`
    } else if (gameState.winner === 'draw') {
      return "That's a draw :("
    } else {
      return `${gameState.currentPlayer}'s turn...`
    }
  }

  console.log(gameState)

    if (isLoading) {
    return <div>Loading...</div>
  }

  return <>
    <h1>TIC-TAC-TOE</h1>
    <h3>{showStatus()}</h3>
    <div className='grid'>
      {gameState.board.map((cell: number, index: number) =>
        <button key={index} onClick={() => gameState.winner === null ? mutate(index) : null}>
          {cell}
        </button>)}
    </div>
  </>
}