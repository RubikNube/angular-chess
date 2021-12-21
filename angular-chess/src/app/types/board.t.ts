export enum Color {
    WHITE="WHITE",
    BLACK="BLACK"
}

export type Position = {
    row: number;
    column: number
}

export type Field={
    highlight:HighlightColor;
    position:Position
}

export enum HighlightColor {
    NONE="NONE",
    YELLOW="YELLOW",
    GREEN="GREEN",
    RED="RED"
}