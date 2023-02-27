import { Board } from "../types/board.t";
import { Piece } from "../types/pieces.t";
import PieceUtils from "./piece.utils";

export default class TestUtils {

    public static checkBoards(expectedBoard: Board | undefined, actualBoard: Board | undefined): void {
        expect(expectedBoard?.blackCastleRights).toEqual(actualBoard?.blackCastleRights);
        expect(expectedBoard?.whiteCastleRights).toEqual(actualBoard?.whiteCastleRights);
        expect(expectedBoard?.enPassantSquare).toEqual(actualBoard?.enPassantSquare);
        expect(expectedBoard?.playerToMove).toEqual(actualBoard?.playerToMove);
        expect(PieceUtils.sortPieces(expectedBoard?.pieces)).toEqual(PieceUtils.sortPieces(actualBoard?.pieces));
    }
}