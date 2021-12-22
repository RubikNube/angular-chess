import { Color, Position } from "./board.t"

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
    piece: PieceType;
    from: Position;
    to: Position;
}