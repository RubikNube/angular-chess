import { Color, Square } from "./compressed.types.t";
import { Piece } from "./pieces.t";

export interface Board {
  pieces: Piece[];
  whiteCastleRights: CastleRights;
  blackCastleRights: CastleRights;
  moveCount: number;
  enPassantSquare?: Square;
  playerToMove: Color;
  result?: Result;
  plyCount?: number;
}

export type SquareWithHighlight = {
  highlight: HighlightColor;
  position: Square
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
  UNKNOWN,
  REMIS,
  WHITE_WIN,
  BLACK_WIN
}