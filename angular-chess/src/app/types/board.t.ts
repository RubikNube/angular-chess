import { Piece } from "./pieces.t"

export type Board = {
    pieces: Piece[];
    whiteCastleRights: CastleRights;
    blackCastleRights: CastleRights;
    moveNumber?: number;
    enPassantSquare?: Position;
}

export enum Color {
    WHITE = "WHITE",
    BLACK = "BLACK"
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
    NONE = "NONE",
    YELLOW = "YELLOW",
    GREEN = "GREEN",
    RED = "RED"
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