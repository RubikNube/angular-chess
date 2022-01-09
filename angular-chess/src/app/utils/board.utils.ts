import { MoveGenerationService } from "../services/move-generation.service";
import { Board, CastleRights, Color, Position, Result } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import PieceUtils from "./piece.utils";
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

    public static isMate(moveGenerationService: MoveGenerationService, board: Board): boolean {
        let king: Piece = BoardUtils.getKing(board, board.playerToMove);
        let validKingMoves: Move[] = moveGenerationService.getValidMoves(board, king);
        let opposedColor: Color = PieceUtils.getOpposedColor(board.playerToMove);
        let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(moveGenerationService, board, opposedColor);


        if (validKingMoves.length === 0 && PositionUtils.includes(attackedSquares, king.position)) {
            let attackingMoves: Move[] = BoardUtils.calculateMovesThatCapturePiece(moveGenerationService, board, king);

            if (attackingMoves.length === 1) {
                let attackingPosition: Position = attackingMoves[0].from;
                let attackedSquaresOfPlayerToMove: Position[] = BoardUtils.calculateAttackedSquares(moveGenerationService, board, board.playerToMove);

                if (PositionUtils.includes(attackedSquaresOfPlayerToMove, attackingPosition)) {
                    let movesThatCaptureCheckGivingPiece: Move[] = BoardUtils.calculateMovesThatCapturePiece(moveGenerationService, board, attackingMoves[0].piece);

                    if (movesThatCaptureCheckGivingPiece.length === 1) {
                        let moveThatCaptureCheckGivingPiece: Move = movesThatCaptureCheckGivingPiece[0];
                        if (moveThatCaptureCheckGivingPiece.piece.type === PieceType.KING) {
                            return BoardUtils.isProtected(moveGenerationService, board, attackingMoves[0].piece);
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

    public static isProtected(moveGenerationService: MoveGenerationService, board: Board, piece: Piece) {
        let copiedBoard: Board = {
            blackCastleRights: board.blackCastleRights,
            pieces: board.pieces.filter(p => !PieceUtils.pieceEquals(p, piece)),
            whiteCastleRights: board.whiteCastleRights,
            playerToMove: board.playerToMove,
            result: board.result,
            enPassantSquare: board.enPassantSquare,
            moveNumber: board.moveNumber
        };

        let foundPos: Position | undefined = copiedBoard.pieces
            .filter(p => p.color === piece.color)
            .flatMap(p => moveGenerationService.getValidMoves(copiedBoard, p).map(m => m.to))
            .find(p => PositionUtils.positionEquals(p, piece.position));

        return foundPos !== undefined;
    }

    private static calculateMovesThatCapturePiece(moveGenerationService: MoveGenerationService, board: Board, piece: Piece): Move[] {
        let attackingMoves: Set<Move> = new Set<Move>();

        board.pieces
            .filter(p => p.color !== piece.color)
            .forEach(p => {
                moveGenerationService.getValidCaptures(board, p)
                    .filter(m => m.capturedPiece !== undefined && PieceUtils.pieceEquals(piece, m.capturedPiece))
                    .forEach(m => {
                        attackingMoves.add(m);
                    });
            });

        return Array.from(attackingMoves.values());
    }

    private static getKing(board: Board, color: Color): Piece {
        let king = board.pieces.find(p => p.color === color && p.type === PieceType.KING);

        if (king !== undefined) {
            return king;
        }
        else {
            throw Error("No king existing with color " + color);
        }
    }

    public static getFreeFrontSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column,
                row: piece.position.row + index
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeBackSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column,
                row: piece.position.row - index
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeLeftSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column - index,
                row: piece.position.row
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeRightSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column + index,
                row: piece.position.row
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeFrontLeftSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column - index,
                row: piece.position.row + index
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeFrontRightSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column + index,
                row: piece.position.row + index
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeBackRightSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column + index,
                row: piece.position.row - index
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getFreeBackLeftSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column - index,
                row: piece.position.row - index
            };

            if (PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
            }
            else {
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedBackSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column,
                row: piece.position.row - index
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedFrontSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column,
                row: piece.position.row + index
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }


    public static getOccupiedLeftSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column - index,
                row: piece.position.row
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedRightSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column + index,
                row: piece.position.row
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedFrontLeftSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column - index,
                row: piece.position.row + index
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedFrontRightSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column + index,
                row: piece.position.row + index
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedBackRightSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column + index,
                row: piece.position.row - index
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }

    public static getOccupiedBackLeftSquare(board: Board, piece: Piece, maxSquares: number): Position[] {
        let squaresToMove: Position[] = [];

        for (let index = 1; index <= maxSquares; index++) {
            let squareToAdd = {
                column: piece.position.column - index,
                row: piece.position.row - index
            };

            if (!PositionUtils.isFree(board, squareToAdd)) {
                squaresToMove.push(squareToAdd);
                break;
            }
        }

        return squaresToMove;
    }
}