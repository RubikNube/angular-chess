import { Board } from "../types/board.t";
import { Piece } from "../types/pieces.t";

export default class TestUtils {

    public static checkBoards(board1: Board | undefined, board2: Board | undefined): void {
        expect(board1?.blackCastleRights).toEqual(board2?.blackCastleRights);
        expect(board1?.whiteCastleRights).toEqual(board2?.whiteCastleRights);
        expect(board1?.enPassantSquare).toEqual(board2?.enPassantSquare);
        expect(board1?.playerToMove).toEqual(board2?.playerToMove);
        expect(this.sortPieces(board1?.pieces)).toEqual(this.sortPieces(board2?.pieces));
    }

    public static sortPieces(pieces: Piece[]|undefined): Piece[] {
        if (pieces === undefined) {
            return [];
        }

        return pieces.sort((a, b) => {
            if (a.position.row < b.position.row) {
                return -1;
            }
            if (a.position.row > b.position.row) {
                return 1;
            }
            if (a.position.column < b.position.column) {
                return -1;
            }
            if (a.position.column > b.position.column) {
                return 1;
            }
            return 0;
        });
    }
}