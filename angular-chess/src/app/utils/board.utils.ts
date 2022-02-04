import { MoveGenerationService } from "../services/move-generation.service";
import { Board, CastleRights, Color, Position, Result } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import PieceUtils from "./piece.utils";
import PositionUtils from "./position.utils";

export default class BoardUtils {
  private static readonly PIECES_MATCHER_CHARS = "[R|B|Q|K|N|P]";

  private static initialBoard: Board = {
    pieces: [],
    whiteCastleRights: { player: Color.WHITE, canLongCastle: true, canShortCastle: true },
    blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
    playerToMove: Color.WHITE,
    result: Result.UNKNOWN,
    moveCount: 0
  };

  public static loadBoardFromFen(newFen: string): Board {
    const currentBoard: Board = this.initialBoard;

    const fenSections = newFen.split(' ');
    const fenRows: string[] = fenSections[0].split("/");

    currentBoard.pieces = this.readPieces(fenRows);

    if (fenSections.length > 1) {
      let playerChar = fenSections[1];

      currentBoard.playerToMove = this.readPlayerToMove(playerChar);
    }


    if (fenSections.length > 2) {
      const castleFen = fenSections[2];

      const { whiteCastleRights, blackCastleRights }: { whiteCastleRights: CastleRights; blackCastleRights: CastleRights; } = this.readCastleRights(castleFen);

      currentBoard.whiteCastleRights = whiteCastleRights;
      currentBoard.blackCastleRights = blackCastleRights;
    }
    else {
      const whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
      const blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

      currentBoard.whiteCastleRights = whiteCastleRights;
      currentBoard.blackCastleRights = blackCastleRights;
    }

    if (fenSections.length > 3) {
      const enPassantFen = fenSections[3];

      const enPassantPosition = PositionUtils.getPositionFromCoordinate(enPassantFen);
      currentBoard.enPassantSquare = enPassantPosition;
    }

    if (fenSections.length > 4) {
      const plyCount = fenSections[4];

      currentBoard.plyCount = +plyCount;
    }

    if (fenSections.length > 5) {
      const moveCount = fenSections[5];

      currentBoard.moveCount = +moveCount;
    }

    return currentBoard;
  }

  private static readPieces(fenRows: string[]): Piece[] {
    const pieces = [];

    for (let j = 0; j < fenRows.length; j++) {
      const fenRow: string = fenRows[j];
      let currentPos: number = 0;

      for (let currentChar of fenRow) {
        if (currentChar.match("\\d")) {
          const columnsToAdd = parseInt(currentChar);
          currentPos += columnsToAdd;
        }
        else if (currentChar.toUpperCase().match(this.PIECES_MATCHER_CHARS)) {
          const newPiece: Piece = {
            color: currentChar.match("[A-Z]") ? Color.WHITE : Color.BLACK,
            type: this.getPiece(currentChar),
            position: { row: 8 - j, column: currentPos + 1 }
          };

          pieces.push(newPiece);
          currentPos++;
        } else {
          console.error("Not a number or a piece char: " + currentChar);
        }
      }
    }

    return pieces;
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

  private static readPlayerToMove(playerChar: string): Color {
    return playerChar === 'w' ? Color.WHITE : Color.BLACK;
  }

  private static readCastleRights(castleFen: string): { whiteCastleRights: CastleRights; blackCastleRights: CastleRights; } {
    const whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
    const blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

    for (let castleChar of castleFen) {
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
    return { whiteCastleRights, blackCastleRights };
  }

  public static isEnPassantSquare(board: Board, position: Position): boolean {
    const enPassantSquare = board.enPassantSquare;

    return enPassantSquare !== undefined && PositionUtils.positionEquals(enPassantSquare, position);
  }

  public static calculateAttackedSquares(moveGenerationService: MoveGenerationService, board: Board, colorOfPieces: Color, includeKing?: boolean): Position[] {
    const attackedSquares: Set<Position> = new Set<Position>();

    board.pieces
      .filter(p => p.color === colorOfPieces)
      .forEach(p => {
        if (p.type === PieceType.KING) {
          if (includeKing !== undefined && !includeKing) {
            return;
          }
          else {
            PositionUtils.getSurroundingSquares(p)
              .filter(this.isOnBoardFunction())
              .forEach(m => {
                attackedSquares.add(m);
              })
          }
        }
        else {
          if (p.type !== PieceType.PAWN) {
            moveGenerationService.getValidMoves(board, p, true)
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

    return Array.from(attackedSquares.values());
  }

  private static isOnBoardFunction(): (value: Position, index: number, array: Position[]) => unknown {
    return p => PositionUtils.isOnBoard(p);
  }

  public static calculateMoveSquares(moveGenerationService: MoveGenerationService, board: Board, colorOfPieces: Color, includeKing?: boolean): Position[] {
    const attackedSquares: Set<Position> = new Set<Position>();

    board.pieces
      .filter(p => p.color === colorOfPieces)
      .forEach(p => {
        if (p.type === PieceType.KING) {
          if (includeKing !== undefined && !includeKing) {
            return;
          }
          else {
            PositionUtils.getSurroundingSquares(p)
              .filter(this.isOnBoardFunction())
              .forEach(m => attackedSquares.add(m))
          }
        }
        else {
          if (p.type === PieceType.PAWN) {
            moveGenerationService.getValidMoves(board, p, true)
              .map(m => m.to)
              .forEach(m => attackedSquares.add(m))
          }

          moveGenerationService.getValidCaptures(board, p)
            .map(m => m.to)
            .forEach(m => attackedSquares.add(m))
        }
      });

    return Array.from(attackedSquares.values());
  }

  public static isMate(moveGenerationService: MoveGenerationService, board: Board): boolean {
    const king: Piece = this.getKing(board, board.playerToMove);

    if (this.hasNoEscapeSquares(moveGenerationService, board, king)) {
      const attackingMoves: Move[] = this.calculateMovesThatCapturePiece(moveGenerationService, board, king);
      const attackingPosition: Position = attackingMoves[0].from;
      const attackedSquaresOfPlayerToMove: Position[] = this.calculateAttackedSquares(moveGenerationService, board, board.playerToMove);

      if (PositionUtils.includes(attackedSquaresOfPlayerToMove, attackingPosition)) {
        const movesThatCaptureCheckGivingPiece: Move[] = this.calculateMovesThatCapturePiece(moveGenerationService, board, attackingMoves[0].piece);

        if (movesThatCaptureCheckGivingPiece.length === 1) {
          return false;
        }
        else {
          return PositionUtils.calculateDistance(king.position, attackingMoves[0].piece.position) === 1;
        }
      }
      else if (this.canBeBlocked(moveGenerationService, board, attackingMoves[0], king)) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  private static hasNoEscapeSquares(moveGenerationService: MoveGenerationService, board: Board, king: Piece) {
    const opposedColor: Color = PieceUtils.getOpposedColor(board.playerToMove);
    const attackedSquares: Position[] = this.calculateAttackedSquares(moveGenerationService, board, opposedColor);
    const validKingMoves: Move[] = moveGenerationService.getValidMoves(board, king, true);

    return validKingMoves.length === 0 && PositionUtils.includes(attackedSquares, king.position);
  }

  public static canBeBlocked(moveGenerationService: MoveGenerationService, board: Board, move: Move, king: Piece) {
    if (move.piece.type === PieceType.PAWN || move.piece.type === PieceType.KNIGHT) {
      return false;
    }
    else {

      if (king.position.column === move.from.column) {
        const attackedSquaresOfPlayerToMove: Position[] = this.calculateAttackedSquares(moveGenerationService, board, board.playerToMove, false);
        return this.canBlockSameColumn(attackedSquaresOfPlayerToMove, king.position, move.from);
      } else if (king.position.row === move.from.row) {
        const attackedSquaresOfPlayerToMove: Position[] = this.calculateAttackedSquares(moveGenerationService, board, board.playerToMove, false);
        return this.canBlockSameRow(attackedSquaresOfPlayerToMove, king.position, move.from);
      } else if (king.position.column < move.from.column && king.position.row < move.from.row) {
        const attackedSquaresOfPlayerToMove: Position[] = this.calculateMoveSquares(moveGenerationService, board, board.playerToMove, false);
        return this.canBlockUpperRightDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }
      else if (king.position.column > move.from.column && king.position.row < move.from.row) {
        const attackedSquaresOfPlayerToMove: Position[] = this.calculateMoveSquares(moveGenerationService, board, board.playerToMove, false);
        return this.canBlockUpperLeftDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }
      else if (king.position.column < move.from.column && king.position.row > move.from.row) {
        const attackedSquaresOfPlayerToMove: Position[] = this.calculateMoveSquares(moveGenerationService, board, board.playerToMove, false);
        return this.canBlockLowerRightDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }
      else if (king.position.column > move.from.column && king.position.row > move.from.row) {
        const attackedSquaresOfPlayerToMove: Position[] = this.calculateMoveSquares(moveGenerationService, board, board.playerToMove, false);
        return this.canBlockLowerLeftDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }

      return false;
    }
  }

  private static canBlockSameColumn(attackedSquaresOfPlayerToMove: Position[], kingPos: Position, attackingPos: Position): boolean {
    if (kingPos.row < attackingPos.row) {
      for (let index = 0; index < attackingPos.row - kingPos.row; index++) {
        const newPos: Position = {
          column: kingPos.column,
          row: kingPos.row + 1 + index
        }

        if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    } else {
      for (let index = 0; index < kingPos.row - attackingPos.row; index++) {
        const newPos: Position = {
          column: kingPos.column,
          row: attackingPos.row - 1 - index
        }

        if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    }

    return false;
  }

  private static canBlockUpperRightDiagonal(attackedSquaresOfPlayerToMove: Position[], kingPos: Position, attackingPos: Position): boolean {
    for (let i = 0; i < attackingPos.row - kingPos.row; i++) {
      const newPos: Position = {
        column: kingPos.column + 1 + i,
        row: kingPos.row + 1 + i
      }

      if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockUpperLeftDiagonal(attackedSquaresOfPlayerToMove: Position[], kingPos: Position, attackingPos: Position): boolean {
    for (let i = 0; i < attackingPos.row - kingPos.row; i++) {
      const newPos: Position = {
        column: kingPos.column - 1 - i,
        row: kingPos.row + 1 + i
      }

      if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockLowerRightDiagonal(attackedSquaresOfPlayerToMove: Position[], kingPos: Position, attackingPos: Position): boolean {
    for (let i = 0; i < kingPos.row - attackingPos.row; i++) {
      const newPos: Position = {
        column: kingPos.column + 1 + i,
        row: kingPos.row - 1 - i
      }

      if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockLowerLeftDiagonal(attackedSquaresOfPlayerToMove: Position[], kingPos: Position, attackingPos: Position): boolean {
    for (let i = 0; i < kingPos.row - attackingPos.row; i++) {
      const newPos: Position = {
        column: kingPos.column - 1 - i,
        row: kingPos.row - 1 - i
      }

      if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockSameRow(attackedSquaresOfPlayerToMove: Position[], kingPos: Position, attackingPos: Position): boolean {
    if (kingPos.column < attackingPos.column) {
      for (let index = 0; index < attackingPos.column - kingPos.column; index++) {
        const newPos: Position = {
          column: kingPos.column + 1 + index,
          row: kingPos.row
        }

        if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    } else {
      for (let index = 0; index < kingPos.column - attackingPos.column; index++) {
        const newPos: Position = {
          column: kingPos.column - 1 - index,
          row: attackingPos.row
        }

        if (PositionUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    }

    return false;
  }


  public static isProtected(moveGenerationService: MoveGenerationService, board: Board, piece: Piece | undefined) {
    if (piece === undefined) {
      return false;
    }

    const copiedBoard: Board = {
      blackCastleRights: board.blackCastleRights,
      pieces: board.pieces.filter(p => !PieceUtils.pieceEquals(p, piece)),
      whiteCastleRights: board.whiteCastleRights,
      playerToMove: board.playerToMove,
      result: board.result,
      enPassantSquare: board.enPassantSquare,
      moveCount: board.moveCount
    };

    const foundPos: Position | undefined = copiedBoard.pieces
      .filter(p => p.color === piece.color)
      .flatMap(p => moveGenerationService.getValidMoves(copiedBoard, p, false).map(m => m.to))
      .find(p => PositionUtils.positionEquals(p, piece.position));

    return foundPos !== undefined;
  }

  private static calculateMovesThatCapturePiece(moveGenerationService: MoveGenerationService, board: Board, piece: Piece): Move[] {
    const attackingMoves: Set<Move> = new Set<Move>();

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
    const king = board.pieces.find(p => p.color === color && p.type === PieceType.KING);

    if (king !== undefined) {
      return king;
    }
    else {
      throw Error("No king existing with color " + color);
    }
  }

  public static getFreeFrontSquares(board: Board, piece: Piece, maxSquares: number): Position[] {
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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
    const squaresToMove: Position[] = [];

    for (let index = 1; index <= maxSquares; index++) {
      const squareToAdd = {
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