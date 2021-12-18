export type Piece = {
    type: PieceType;
    color: PieceColor;
    position: Position;
}

export type Position = {
    row: number;
    column: number
}

export enum PieceType {
    KING = "KING",
    QUEEN = "QUEEN",
    BISHOP = "BISHOP",
    KNIGHT = "KNIGHT",
    PAWN = "PAWN",
    ROOK = "ROOK"
}

export enum PieceColor {
    WHITE="WHITE",
    BLACK="BLACK"
}