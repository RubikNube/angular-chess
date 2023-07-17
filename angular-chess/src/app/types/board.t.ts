import { Piece } from "./pieces.t";

export const COLOR_WHITE = true
export const COLOR_BLACK = false

export interface Board {
  pieces: Piece[];
  whiteCastleRights: CastleRights;
  blackCastleRights: CastleRights;
  moveCount: number;
  enPassantSquare?: Position;
  playerToMove: boolean;
  result?: Result;
  plyCount?: number;
}

export type Position = {
  row: number;
  column: number
}

export type Square = {
  highlight: HighlightColor;
  position: Position
}

export enum HighlightColor {
  NONE = "N",
  YELLOW = "Y",
  GREEN = "G",
  RED = "R",
  BLUE = "B"
}

export type CastleRights = {
  player: boolean,
  canShortCastle: boolean,
  canLongCastle: boolean
}

export enum Result {
  UNKNOWN = "U",
  REMIS = "R",
  WHITE_WIN = "W",
  BLACK_WIN = "B"
}