import { CastlingRights, Color, Piece, Square } from "./compressed.types.t";


export interface Board {
  pieces: Piece[];
  castlingRights: CastlingRights;
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

export enum Result {
  UNKNOWN,
  REMIS,
  WHITE_WIN,
  BLACK_WIN
}