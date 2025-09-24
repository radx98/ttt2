type Player = 'X' | 'O'
type Cell = Player | null
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type GameState = {
    currentPlayer: Player;
    winner: Player | null | 'draw';
    board: Board;
}