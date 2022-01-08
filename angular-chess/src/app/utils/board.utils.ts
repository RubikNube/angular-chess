import { MoveGenerationService } from "../services/move-generation.service";
import { Board, CastleRights, Color, Position, Result } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import PositionUtils from "./position.utils";

export default class BoardUtils {
    static initialBoard: Board = {
        pieces: [],
        whiteCastleRights: { player: Color.WHITE, canLongCastle: true, canShortCastle: true },
        blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
        playerToMove: Color.WHITE,
        result: Result.UNKNOWN,
    };

    public static loadBoardFromFen(newFen: string): Board {
        let currentBoard: Board = BoardUtils.initialBoard;
        let pieces: Piece[] = [];

        let fenSections = newFen.split(' ');

        let fenRows: string[] = fenSections[0].split("/");
        for (let j = 0; j < fenRows.length; j++) {
            let fenRow: string = fenRows[j];
            let currentPos: number = 0;
            for (let i = 0; i < fenRow.length; i++) {
                const currentChar = fenRow[i];
                console.log("currentChar " + currentChar);

                if (currentChar.match("\\d")) {
                    let columnsToAdd = parseInt(currentChar);
                    console.log("columnsToAdd " + columnsToAdd);
                    currentPos += columnsToAdd;
                }
                else if (currentChar.toUpperCase().match("[R|B|Q|K|N|P]")) {
                    let newPiece: Piece = {
                        color: currentChar.match("[A-Z]") ? Color.WHITE : Color.BLACK,
                        type: BoardUtils.getPiece(currentChar),
                        position: { row: 8 - j, column: currentPos + 1 }
                    };

                    console.log("add piece " + JSON.stringify(newPiece))

                    pieces.push(newPiece);
                    currentPos++;
                } else {
                    console.error("Not a number or a piece char: " + currentChar);
                }
            }
        };

        currentBoard.pieces = pieces;

        if (fenSections.length > 1) {
            let playerChar = fenSections[1];

            currentBoard.playerToMove = playerChar === 'w' ? Color.WHITE : Color.BLACK;
        }


        if (fenSections.length > 2) {
            let castleFen = fenSections[2];

            let whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
            let blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

            for (let index = 0; index < castleFen.length; index++) {
                const castleChar = castleFen[index];


                switch (castleChar) {
                    case 'K':
                        whiteCastleRights.canShortCastle = true;
                        break;
                    case 'Q':
                        whiteCastleRights.canLongCastle = true;
                        break;
                    case 'k':
                        blackCastleRights.canShortCastle = true;
                        break;
                    case 'q':
                        blackCastleRights.canLongCastle = true;
                        break;

                    default:
                        break;
                }
            }

            currentBoard.whiteCastleRights = whiteCastleRights;
            currentBoard.blackCastleRights = blackCastleRights;
        }
        else {
            let whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
            let blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

            currentBoard.whiteCastleRights = whiteCastleRights;
            currentBoard.blackCastleRights = blackCastleRights;
        }

        if (fenSections.length > 3) {
            let enPassantFen = fenSections[3];

            let enPassantPosition = PositionUtils.getPositionFromCoordinate(enPassantFen);
            currentBoard.enPassantSquare = enPassantPosition;
        }

        return currentBoard;
    }


    public static getPiece(pieceChar: string): PieceType {
        switch (pieceChar.toUpperCase()) {
            case 'K':
                return PieceType.KING;
            case 'Q':
                return PieceType.QUEEN;
            case 'R':
                return PieceType.ROOK;
            case 'B':
                return PieceType.BISHOP;
            case 'N':
                return PieceType.KNIGHT;
            case 'P':
                return PieceType.PAWN;
            default:
                throw Error("Unknown piece: " + pieceChar);
        }
    }

    public static isEnPassantSquare(board: Board, position: Position): boolean {
        let enPassantSquare = board.enPassantSquare;

        return enPassantSquare !== undefined && PositionUtils.positionEquals(enPassantSquare, position);
    }

    public static calculateAttackedSquares(moveGenerationService: MoveGenerationService, board: Board, colorOfPieces: Color): Position[] {
        let attackedSquares: Set<Position> = new Set<Position>();

        board.pieces
            .filter(p => p.color === colorOfPieces)
            .forEach(p => {
                if (p.type === PieceType.KING) {
                    PositionUtils.getSurroundingSquares(p)
                        .filter(p => PositionUtils.isOnBoard(p))
                        .forEach(m => {
                            attackedSquares.add(m);
                        })
                }
                else {
                    if (p.type !== PieceType.PAWN) {
                        moveGenerationService.getValidMoves(board, p)
                            .map(m => m.to).forEach(m => {
                                attackedSquares.add(m);
                            });
                    }

                    moveGenerationService.getValidCaptures(board, p)
                        .map(m => m.to).forEach(m => {
                            attackedSquares.add(m);
                        });
                }
            });

        let result = Array.from(attackedSquares.values());

        console.log("calculateAttackedSquares color:" + colorOfPieces + ", result: " + JSON.stringify(result))

        return result;
    }
}