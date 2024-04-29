import { Color } from "./compressed.types.t";
import { Piece } from "./pieces.t";

export interface Board {
  pieces: Piece[];
  whiteCastleRights: CastleRights;
  blackCastleRights: CastleRights;
  moveCount: number;
  enPassantSquare?: Position;
  playerToMove: Color;
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
  NONE,
  YELLOW,
  GREEN,
  RED,
  BLUE
}

export type CastleRights = {
  player: Color,
  canShortCastle: boolean,
  canLongCastle: boolean
}

export enum Result {
  UNKNOWN = "UNKNOWN",
  REMIS = "REMIS",
  WHITE_WIN = "WHITE_WIN",
  BLACK_WIN = "BLACK_WIN"
}