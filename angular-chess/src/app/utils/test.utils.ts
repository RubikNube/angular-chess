import { Board } from "../types/board.t";
import { Piece } from "../types/pieces.t";
import PieceUtils from "./piece.utils";

export default class TestUtils {

    public static checkBoards(board1: Board | undefined, board2: Board | undefined): void {
        expect(board1?.blackCastleRights).toEqual(board2?.blackCastleRights);
        expect(board1?.whiteCastleRights).toEqual(board2?.whiteCastleRights);
        expect(board1?.enPassantSquare).toEqual(board2?.enPassantSquare);
        expect(board1?.playerToMove).toEqual(board2?.playerToMove);
        expect(PieceUtils.sortPieces(board1?.pieces)).toEqual(PieceUtils.sortPieces(board2?.pieces));
    }
}