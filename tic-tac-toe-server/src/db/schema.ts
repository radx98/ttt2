import { jsonb, pgTable, serial, text, pgEnum, uuid } from "drizzle-orm/pg-core";

type Player = 'X' | 'O'
type Cell = Player | null
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
type GameState = {
    id: string;
    currentPlayer: Player;
    winner: Player | null | 'draw';
    board: Board;
}

export const playerEnum = pgEnum('currentPlayer', ['X', 'O'])
export const winnerEnum = pgEnum('winner', ['X', 'O', 'draw'])

export const games = pgTable('games', {
  id: uuid('id').primaryKey(),
  currentPlayer: playerEnum('currentPlayer').notNull(),
  winner: winnerEnum('winner'),
  board: jsonb('board').notNull().$type<Board>()
})