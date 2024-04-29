import { Board, Position } from "./board.t";
import { Color } from "./compressed.types.t";

export type Piece = {
  type: PieceType;
  color: Color;
  position: Position;
}

export enum PieceType {
  KING = "KING",
  QUEEN = "QUEEN",
  BISHOP = "BISHOP",
  KNIGHT = "KNIGHT",
  PAWN = "PAWN",
  ROOK = "ROOK"
}

export type Move = {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  isEnPassant?: boolean;
  isShortCastle?: boolean;
  isLongCastle?: boolean;
  isCheck?: boolean;
  isMate?: boolean;
  promotedPiece?: Piece;
  boardAfterMove?: Board
}

export type FullMove = {
  count: number,
  whiteMove?: Move,
  blackMove?: Move
}