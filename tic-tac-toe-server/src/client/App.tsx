import './App.css'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {useState} from 'react'

export default function App() {
  const [gameId, setGameId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  function GameList({onSelect}: {onSelect: (id: string) => void}) {
    const {data: gameList, isLoading} = useQuery({
      queryKey: ['games'],
      queryFn: async () => {
        const res = await fetch('/games')
        if (!res.ok) throw new Error('Failed to fetch games')
        return res.json()
      }
    })

    const createGame = useMutation({
      mutationFn: async () => {
        const res = await fetch('/game/new', { method: 'POST' })
        if (!res.ok) throw new Error('Failed to create game')
        return res.json()
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['games'] })
        onSelect(data.id)
      }
    })

    const deleteAll = useMutation({
      mutationFn: async () => {
        const res = await fetch('/games/del', { method: 'POST' })
        if (!res.ok) throw new Error('Failed to delete all games')
        return res.json()
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['games'] })
        onSelect(data.id)
        setGameId(null)
      }
    })

    if (isLoading) return <div>Loading...</div>

    function showDelButton() {
      if (gameList.length != 0) {
          return (
            <button className='px-6 py-2 rounded-full' onClick={() => deleteAll.mutate()}>
              Delete all
            </button>
          )
      }
  }

    return (
      <>
        <h1>TIC-TAC-TOE</h1>
        <div className='flex flex-col justify-center mt-8 gap-2'>
          <button className='px-6 py-2 rounded-full mb-12 self-center' onClick={() => createGame.mutate()}>New Game</button>
          {gameList.map((id: string) => (
            <button className='px-6 py-2 rounded-2xl max-w-64' key={id} onClick={() => onSelect(id)}>
              {id}
            </button>
          ))}
          <div className='flex justify-center m-8'>
            {showDelButton()}
          </div>
        </div>
      </>
    )
  }

  function GameBoard({ gameId }: { gameId: string }) {
    const { data: gameState, isLoading } = useQuery({
      queryKey: ['game', gameId],
      queryFn: async () => {
        const res = await fetch(`/game/${gameId}`)
        if (!res.ok) throw new Error('Failed to fetch game')
        return res.json()
      }
    })

    const move = useMutation({
      mutationFn: async (index: number) => {
        const res = await fetch(`/game/${gameId}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index })
        })
        if (!res.ok) throw new Error('Failed to make move')
        if (index === 9) {
          setGameId(null)
        }
        return res.json()
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['game', gameId] })
      }
    })

    if (isLoading || !gameState) return <div>Loading...</div>

    function showStatus() {
      if (gameState.winner && gameState.winner !== 'draw') {
        return `${gameState.winner} won!`
      } else if (gameState.winner === 'draw') {
        return "That's a draw :("
      } else {
        return `${gameState.currentPlayer}'s turn...`
      }
    }

    return <>
      <h1>TIC-TAC-TOE</h1>
      <h3>{showStatus()}</h3>
      <div className='grid'>
        {gameState.board.map((cell: 'X' | 'O' | null, index: number) => (
          <button
            className='rounded-2xl'
            key={index}
            onClick={() => (gameState.winner == null && cell == null ? move.mutate(index) : null)}
          >
            {cell}
          </button>
        ))}
      </div>
      <div className='flex justify-center m-8'>
        <button className='px-6 py-2 rounded-full' onClick={() => move.mutate(9)}>
          Delete Game
        </button>
      </div>
    </>
  }

  return gameId === null ? <GameList onSelect={setGameId} /> : <GameBoard gameId={gameId} />
}