import { BoardBuilder } from "../builders/board.builder";
import { MoveGenerationService } from "../services/move-generation.service";
import { Board, CastleRights, Color, Position } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import PieceUtils from "./piece.utils";
import PositionUtils from "./position.utils";

export default class BoardUtils {
  private static readonly PIECES_MATCHER_CHARS = "[R|B|Q|K|N|P]";

  public static loadBoardFromFen(newFen: string): Board {
    const board: BoardBuilder = new BoardBuilder();

    const fenSections = newFen.split(' ');
    const fenRows: string[] = fenSections[0].split("/");

    board.pieces(this.readPieces(fenRows));

    if (fenSections.length > 1) {
      let playerChar = fenSections[1];

      board.playerToMove(this.readPlayerToMove(playerChar));
    }


    if (fenSections.length > 2) {
      const castleFen = fenSections[2];

      const { whiteCastleRights, blackCastleRights }: { whiteCastleRights: CastleRights; blackCastleRights: CastleRights; } = this.readCastleRights(castleFen);

      board.whiteCastleRights(whiteCastleRights);
      board.blackCastleRights(blackCastleRights);
    }
    else {
      const whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
      const blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

      board.whiteCastleRights(whiteCastleRights);
      board.blackCastleRights(blackCastleRights);
    }

    if (fenSections.length > 3) {
      const enPassantFen = fenSections[3];

      const enPassantPosition = PositionUtils.getPositionFromCoordinate(enPassantFen);
      board.enPassantSquare(enPassantPosition);
    }

    if (fenSections.length > 4) {
      const plyCount = fenSections[4];

      board.plyCount(+plyCount);
    }

    if (fenSections.length > 5) {
      const moveCount = fenSections[5];

      board.moveCount(+moveCount);
    }

    return board.build();
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
    const attackedSquares: Position[] = this.calculateAttackedSquares(moveGenerationService, board, PieceUtils.getOpposedColor(board.playerToMove));
    const attackingMoves: Move[] = this.calculateMovesThatCapturePiece(moveGenerationService, board, king);

    const isCheck = this.isCheck(attackedSquares, king.position);
    const hasNoEscapeSquares = !this.hasEscapeSquares(board, attackedSquares, king);
    const cannotBlockChecks = !this.canBlockChecks(moveGenerationService, board, king, attackingMoves);
    const cannotCaptureAttackingPiece = !this.canCaptureAttackingPiece(moveGenerationService, board, attackingMoves);

    return isCheck
      && hasNoEscapeSquares
      && cannotBlockChecks
      && cannotCaptureAttackingPiece;
  }

  private static isCheck(attackedSquares: Position[], kingPosition: Position): boolean {
    return PositionUtils.includes(attackedSquares, kingPosition);
  }

  private static hasEscapeSquares(board: Board, attackedSquares: Position[], king: Piece): boolean {
    return PositionUtils.getSurroundingSquares(king)
      .find(s => PositionUtils.isOnBoard(s)
        && PositionUtils.isFree(board, s)
        && !PositionUtils.includes(attackedSquares, s))
      !== undefined;
  }

  private static canBlockChecks(moveGenerationService: MoveGenerationService, board: Board, king: Piece, attackingMoves: Move[]): boolean {
    return attackingMoves.find(m => !this.canBeBlocked(moveGenerationService, board, m, king)) === undefined;
  }

  private static canCaptureAttackingPiece(moveGenerationService: MoveGenerationService, board: Board, attackingMoves: Move[]): boolean {
    const attackingPieces: Piece[] = attackingMoves.map(m => m.piece);

    if (attackingPieces.length === 0) {
      return true;
    } else if (attackingPieces.length === 1) {
      const attackingPiece = attackingPieces[0];

      const moveThatCaptureAttackingPiece = BoardUtils.calculateMovesThatCapturePiece(moveGenerationService, board, attackingPiece);

      return moveThatCaptureAttackingPiece.length > 0;
    }
    else {
      return true;
    }
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

  public static calculateMovesThatCapturePiece(moveGenerationService: MoveGenerationService, board: Board, piece: Piece): Move[] {
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

  public static getFen(board: Board): string {
    return [
      this.getPieceFen(board),
      this.getMoveRightFen(board),
      this.getCastleRightFen(board),
      this.getEnPassantFen(board),
      this.getPlyFen(board),
      this.getMoveFen(board)
    ].join(" ");
  }

  public static getMoveFen(board: Board): string {
    return board.moveCount + "";
  }

  public static getPlyFen(board: Board): string {
    return board.plyCount !== undefined ? board.plyCount + "" : "0";
  }

  public static getEnPassantFen(board: Board): string {
    return board.enPassantSquare !== undefined ? PositionUtils.getCoordinate(board.enPassantSquare) : "-";
  }

  public static getCastleRightFen(board: Board): string {
    let castleRightFen: string = "";

    if (board.whiteCastleRights.canShortCastle) {
      castleRightFen += "K";
    }
    if (board.whiteCastleRights.canLongCastle) {
      castleRightFen += "Q";
    }
    if (board.blackCastleRights.canShortCastle) {
      castleRightFen += "k";
    }
    if (board.blackCastleRights.canLongCastle) {
      castleRightFen += "q";
    }

    return castleRightFen !== "" ? castleRightFen : "-";
  }

  public static getMoveRightFen(board: Board): string {
    return board.playerToMove === Color.WHITE ? "w" : "b";
  }

  public static getPieceFen(board: Board): string {
    const pieces: Piece[] = Object.assign([], board.pieces);

    pieces.sort((a, b) =>
      this.comparePositions(a.position, b.position)
    )

    let rows: Piece[][] = [[]];
    for (let index = 0; index < 8; index++) {
      rows[index] = [];
    }

    pieces.forEach(piece => {
      console.info("piece:" + JSON.stringify(piece));
      rows[piece.position.row - 1].push(piece);
    });

    rows.reverse();

    return rows
      .map(row => BoardUtils.getRowFen(row))
      .join("/");
  }

  public static getRowFen(row: Piece[]): string {
    let rowFen: string = "";

    let lastColumn: number = 0;

    row.forEach(p => {
      let columnDif: number = p.position.column - lastColumn;
      if (p.position.column - lastColumn > 1) {
        rowFen += columnDif - 1;
      }
      lastColumn = p.position.column;
      rowFen += PieceUtils.getPieceFenChar(p.type, p.color);
    });

    if (lastColumn < 8) {
      rowFen += 8 - lastColumn;
    }

    return rowFen;
  }

  private static comparePositions(a: Position, b: Position): number {
    const rowDifference = a.row - b.row;

    if (rowDifference < 0) {
      return 1;
    }
    else if (rowDifference > 0) {
      return -1;
    }
    else {
      return a.column - b.column;
    }
  }
}