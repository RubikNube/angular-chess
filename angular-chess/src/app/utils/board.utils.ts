import { BoardBuilder } from "../builders/board.builder";
import { Board } from "../types/board.t";
import { CastlingRights, Color, Direction, PieceType, Square } from "../types/compressed.types.t";
import { Move, Piece } from "../types/pieces.t";
import LoggingUtils, { LogLevel } from "./logging.utils";
import MoveGenerationUtils from "./move-generation/move.generation.utils";
import PieceUtils from "./piece.utils";
import SquareUtils from "./square.utils";

export default class BoardUtils {
  private static readonly PIECES_MATCHER_CHARS = "[R|B|Q|K|N|P]";

  /**
   * Loads a chess board from a FEN (Forsyth-Edwards Notation) string.
   * @param newFen The FEN string representing the chess board.
   * @returns The loaded chess board.
   */
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

      const castlingRights = this.readCastleRights(castleFen);
      board.setCastleRights(castlingRights);
    }
    else {
      board.setCastleRights(CastlingRights.NO_CASTLING);
    }

    if (fenSections.length > 3) {
      const enPassantFen = fenSections[3];

      const enPassantSquare = SquareUtils.getSquareFromCoordinate(enPassantFen);
      board.enPassantSquare(enPassantSquare);
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
            type: this.getPieceType(currentChar),
            position: SquareUtils.convertPositionToSquare({ row: 8 - j, column: currentPos + 1 })
          };

          pieces.push(newPiece);
          currentPos++;
        } else {
          LoggingUtils.log(LogLevel.ERROR, () => "Not a number or a piece char: " + currentChar);
        }
      }
    }

    return pieces;
  }

  public static getPieceType(pieceChar: string): PieceType {
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

  private static readCastleRights(castleFen: string): CastlingRights {
    let castlingRights: CastlingRights = CastlingRights.NO_CASTLING;
    for (let castleChar of castleFen) {
      switch (castleChar) {
        case 'K':
          castlingRights |= CastlingRights.WHITE_OO;
          break;
        case 'Q':
          castlingRights |= CastlingRights.WHITE_OOO;
          break;
        case 'k':
          castlingRights |= CastlingRights.BLACK_OO;
          break;
        case 'q':
          castlingRights |= CastlingRights.BLACK_OOO;
          break;
        default:
          break;
      }
    }
    return castlingRights;
  }

  public static isEnPassantSquare(board: Board, position: Square): boolean {
    const enPassantSquare = board.enPassantSquare;

    return enPassantSquare !== undefined && SquareUtils.squareEquals(enPassantSquare, position);
  }

  public static calculateBlockingSquares(board: Board, colorOfPieces: Color): Square[] {
    const blockingSquares: Set<Square> = new Set<Square>();

    board.pieces
      .filter(p => p.color === colorOfPieces && p.type !== PieceType.KING)
      .forEach(p => {
        if (p.type === PieceType.PAWN) {
          MoveGenerationUtils.getValidMoves(board, p, true)
            .map(m => m.to).forEach(m => {
              blockingSquares.add(m);
            });
        }
        else {
          MoveGenerationUtils.getValidMoves(board, p, true)
            .map(m => m.to).forEach(m => {
              blockingSquares.add(m);
            });

          MoveGenerationUtils.getValidCaptures(board, p, true)
            .map(m => m.to).forEach(m => {
              blockingSquares.add(m);
            });
        }
      });

    return Array.from(blockingSquares.values());
  }

  private static isOnBoardFunction(): (value: Square, index: number, array: Square[]) => unknown {
    return p => SquareUtils.isOnBoard(p);
  }

  public static calculateMoveSquares(board: Board, colorOfPieces: Color, includeKingOrPawn?: boolean): Square[] {
    const attackedSquares: Set<Square> = new Set<Square>();

    board.pieces
      .filter(p => p.color === colorOfPieces)
      .forEach(p => {
        if (p.type === PieceType.KING) {
          if (includeKingOrPawn !== undefined && !includeKingOrPawn) {
            return;
          }
          else {
            SquareUtils.getSurroundingSquares(p)
              .filter(this.isOnBoardFunction())
              .forEach(m => attackedSquares.add(m))
          }
        }
        else {
          if (p.type === PieceType.PAWN && includeKingOrPawn) {
            MoveGenerationUtils.getValidMoves(board, p, true)
              .map(m => m.to)
              .forEach(m => attackedSquares.add(m))
          }

          MoveGenerationUtils.getValidCaptures(board, p)
            .map(m => m.to)
            .forEach(m => attackedSquares.add(m))
        }
      });

    return Array.from(attackedSquares.values());
  }

  private static isCheck(attackedSquares: Square[], kingSquare: Square): boolean {
    return SquareUtils.includes(attackedSquares, kingSquare);
  }

  private static hasEscapeSquares(board: Board, attackedSquares: Square[], king: Piece): boolean {
    return SquareUtils.getSurroundingSquares(king)
      .find(s => SquareUtils.isOnBoard(s)
        && SquareUtils.isFree(board, s)
        && !SquareUtils.includes(attackedSquares, s))
      !== undefined;
  }

  private static canBlockChecks(board: Board, king: Piece, attackingMoves: Move[]): boolean {
    return attackingMoves.find(m => !this.canBeBlocked(board, m, king)) === undefined;
  }

  private static canCaptureAttackingPiece(board: Board, attackingMoves: Move[]): boolean {
    const attackingPieces: Piece[] = attackingMoves.map(m => m.piece);

    if (attackingPieces.length === 0) {
      return true;
    } else if (attackingPieces.length === 1) {
      const attackingPiece = attackingPieces[0];

      const moveThatCaptureAttackingPiece = BoardUtils.calculateMovesThatCapturePiece(board, attackingPiece);

      return moveThatCaptureAttackingPiece.length > 0;
    }
    else {
      return true;
    }
  }

  public static canBeBlocked(board: Board, move: Move, king: Piece) {
    if (move.piece.type === PieceType.PAWN || move.piece.type === PieceType.KNIGHT) {
      return false;
    }
    else {

      if (SquareUtils.fileOf(king.position) === SquareUtils.fileOf(move.from)) {
        const attackedSquaresOfPlayerToMove: Square[] = this.calculateBlockingSquares(board, board.playerToMove);
        return this.canBlockSameColumn(attackedSquaresOfPlayerToMove, king.position, move.from);
      } else if (SquareUtils.rankOf(king.position) === SquareUtils.rankOf(move.from)) {
        const attackedSquaresOfPlayerToMove: Square[] = this.calculateBlockingSquares(board, board.playerToMove);
        return this.canBlockSameRow(attackedSquaresOfPlayerToMove, king.position, move.from);
      } else if (SquareUtils.fileOf(king.position) < SquareUtils.fileOf(move.from) && SquareUtils.rankOf(king.position) < SquareUtils.rankOf(move.from)) {
        const attackedSquaresOfPlayerToMove: Square[] = this.calculateBlockingSquares(board, board.playerToMove);
        return this.canBlockUpperRightDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }
      else if (SquareUtils.fileOf(king.position) > SquareUtils.fileOf(move.from) && SquareUtils.rankOf(king.position) < SquareUtils.rankOf(move.from)) {
        const attackedSquaresOfPlayerToMove: Square[] = this.calculateBlockingSquares(board, board.playerToMove);
        return this.canBlockUpperLeftDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }
      else if (SquareUtils.fileOf(king.position) < SquareUtils.fileOf(move.from) && SquareUtils.rankOf(king.position) > SquareUtils.rankOf(move.from)) {
        const attackedSquaresOfPlayerToMove: Square[] = this.calculateBlockingSquares(board, board.playerToMove);
        return this.canBlockLowerRightDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }
      else if (SquareUtils.fileOf(king.position) > SquareUtils.fileOf(move.from) && SquareUtils.rankOf(king.position) > SquareUtils.rankOf(move.from)) {
        const attackedSquaresOfPlayerToMove: Square[] = this.calculateBlockingSquares(board, board.playerToMove);
        return this.canBlockLowerLeftDiagonal(attackedSquaresOfPlayerToMove, king.position, move.from);
      }

      return false;
    }
  }

  private static canBlockSameColumn(attackedSquaresOfPlayerToMove: Square[], kingSquare: Square, attackingSquare: Square): boolean {
    const kingPos = SquareUtils.convertSquareToPosition(kingSquare);
    const attackingPos = SquareUtils.convertSquareToPosition(attackingSquare);
    if (kingPos.row < attackingPos.row) {
      for (let index = 0; index < attackingPos.row - kingPos.row; index++) {
        const newPos: Square = SquareUtils.convertPositionToSquare({
          column: kingPos.column,
          row: kingPos.row + 1 + index
        });

        if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    } else {
      for (let index = 0; index < kingPos.row - attackingPos.row; index++) {
        const newPos: Square = SquareUtils.convertPositionToSquare({
          column: kingPos.column,
          row: attackingPos.row - 1 - index
        });

        if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    }

    return false;
  }

  private static canBlockUpperRightDiagonal(attackedSquaresOfPlayerToMove: Square[], kingSquare: Square, attackingSquare: Square): boolean {
    const kingPos = SquareUtils.convertSquareToPosition(kingSquare);
    const attackingPos = SquareUtils.convertSquareToPosition(attackingSquare);
    for (let i = 0; i < attackingPos.row - kingPos.row; i++) {
      const newPos: Square = SquareUtils.convertPositionToSquare({
        column: kingPos.column + 1 + i,
        row: kingPos.row + 1 + i
      })

      if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockUpperLeftDiagonal(attackedSquaresOfPlayerToMove: Square[], kingSquare: Square, attackingSquare: Square): boolean {
    const kingPos = SquareUtils.convertSquareToPosition(kingSquare);
    const attackingPos = SquareUtils.convertSquareToPosition(attackingSquare);

    for (let i = 0; i < attackingPos.row - kingPos.row; i++) {
      const newPos: Square = SquareUtils.convertPositionToSquare({
        column: kingPos.column - 1 - i,
        row: kingPos.row + 1 + i
      })

      if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockLowerRightDiagonal(attackedSquaresOfPlayerToMove: Square[], kingSquare: Square, attackingSquare: Square): boolean {
    const kingPos = SquareUtils.convertSquareToPosition(kingSquare);
    const attackingPos = SquareUtils.convertSquareToPosition(attackingSquare);

    for (let i = 0; i < kingPos.row - attackingPos.row; i++) {
      const newPos: Square = SquareUtils.convertPositionToSquare({
        column: kingPos.column + 1 + i,
        row: kingPos.row - 1 - i
      })

      if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockLowerLeftDiagonal(attackedSquaresOfPlayerToMove: Square[], kingSquare: Square, attackingSquare: Square): boolean {
    const kingPos = SquareUtils.convertSquareToPosition(kingSquare);
    const attackingPos = SquareUtils.convertSquareToPosition(attackingSquare);

    for (let i = 0; i < kingPos.row - attackingPos.row; i++) {
      const newPos: Square = SquareUtils.convertPositionToSquare({
        column: kingPos.column - 1 - i,
        row: kingPos.row - 1 - i
      })

      if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
        return true;
      }
    }

    return false;
  }

  private static canBlockSameRow(attackedSquaresOfPlayerToMove: Square[], kingSquare: Square, attackingSquare: Square): boolean {
    const kingPos = SquareUtils.convertSquareToPosition(kingSquare);
    const attackingPos = SquareUtils.convertSquareToPosition(attackingSquare);

    if (kingPos.column < attackingPos.column) {
      for (let index = 0; index < attackingPos.column - kingPos.column; index++) {
        const newPos: Square = SquareUtils.convertPositionToSquare({
          column: kingPos.column + 1 + index,
          row: kingPos.row
        });

        if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    } else {
      for (let index = 0; index < kingPos.column - attackingPos.column; index++) {
        const newPos: Square = SquareUtils.convertPositionToSquare({
          column: kingPos.column - 1 - index,
          row: attackingPos.row
        });

        if (SquareUtils.includes(attackedSquaresOfPlayerToMove, newPos)) {
          return true;
        }
      }
    }

    return false;
  }


  public static isProtected(board: Board, piece: Piece | undefined) {
    if (piece === undefined) {
      return false;
    }

    const copiedBoard: Board = {
      pieces: board.pieces.filter(p => !PieceUtils.pieceEquals(p, piece)),
      castlingRights: board.castlingRights,
      playerToMove: board.playerToMove,
      result: board.result,
      enPassantSquare: board.enPassantSquare,
      moveCount: board.moveCount
    };

    const foundPos: Square | undefined = copiedBoard.pieces
      .filter(p => p.color === piece.color)
      .flatMap(p => MoveGenerationUtils.getAttackingSquares(p, copiedBoard))
      .find(p => SquareUtils.squareEquals(p, piece.position));

    return foundPos !== undefined;
  }

  public static calculateMovesThatCapturePiece(board: Board, piece: Piece): Move[] {
    const attackingMoves: Set<Move> = new Set<Move>();

    board.pieces
      .filter(p => p.color !== piece.color)
      .forEach(p => {
        MoveGenerationUtils.getValidCaptures(board, p)
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

  /**
   * Retrieves the free squares in a given direction from a specified piece on the board.
   * 
   * @param board - The chess board.
   * @param piece - The chess piece.
   * @param direction - The direction to move in.
   * @param maxSquares - The maximum number of squares to check.
   * @returns An array of free squares in the specified direction.
   */
  public static getFreeSquaresInDirection(board: Board, piece: Piece, direction: Direction, maxSquares: number = 8): Square[] {
    const squaresToMove: Square[] = [];

    let oldSquare = piece.position;
    let nextSquare = SquareUtils.getSquareInDirection(oldSquare, direction);
    let squaresChecked = 0;

    while (SquareUtils.isOnBoard(nextSquare) && SquareUtils.isFree(board, nextSquare) && BoardUtils.getDistanceOfSquares(oldSquare, nextSquare) === 1 && squaresChecked < maxSquares) {
      squaresToMove.push(nextSquare);

      squaresChecked++;
      oldSquare = nextSquare;
      nextSquare = SquareUtils.getSquareInDirection(oldSquare, direction);
    }

    return squaresToMove;
  }

  /**
   * Retrieves the occupied square in a given direction from a specified piece on the board.
   * @param board The chess board.
   * @param piece The chess piece.
   * @param direction The direction to check for occupied square.
   * @param maxSquares The maximum number of square to check.
   * @returns An array of occupied square in the specified direction.
   */
  public static getOccupiedSquareInDirection(board: Board, piece: Piece, direction: Direction, maxSquares: number = 8): Square[] {
    const occupiedSquare: Square[] = [];

    let oldSquare = piece.position;
    let nextSquare = SquareUtils.getSquareInDirection(oldSquare, direction);
    let squaresChecked = 0;

    while (SquareUtils.isOnBoard(nextSquare) && this.getDistanceOfSquares(oldSquare, nextSquare) === 1 && squaresChecked < maxSquares) {
      squaresChecked++;

      if (!SquareUtils.isFree(board, nextSquare)) {
        occupiedSquare.push(nextSquare);
        break;
      }

      oldSquare = nextSquare;
      nextSquare = SquareUtils.getSquareInDirection(oldSquare, direction);
    }

    return occupiedSquare;
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
    return board.enPassantSquare !== undefined ? SquareUtils.getSquareRepresentation(board.enPassantSquare) ?? "-" : "-";
  }

  public static getCastleRightFen(board: Board): string {
    let castleRightFen: string = "";

    if (board.castlingRights === undefined) {
      return "-";
    }
    if (board.castlingRights === CastlingRights.NO_CASTLING) {
      return "-";
    }

    if ((board.castlingRights & CastlingRights.WHITE_OO) !== 0) {
      castleRightFen += "K";
    }

    if ((board.castlingRights & CastlingRights.WHITE_OOO) !== 0) {
      castleRightFen += "Q";
    }

    if ((board.castlingRights & CastlingRights.BLACK_OO) !== 0) {
      castleRightFen += "k";
    }

    if ((board.castlingRights & CastlingRights.BLACK_OOO) !== 0) {
      castleRightFen += "q";
    }

    return castleRightFen !== "" ? castleRightFen : "-";
  }

  public static getMoveRightFen(board: Board): string {
    return board.playerToMove === Color.WHITE ? "w" : "b";
  }

  public static getPieceFen(board: Board): string {
    const pieces: Piece[] = Object.assign([], board.pieces);

    pieces.sort((a, b) => a.position - b.position);

    let rows: Piece[][] = [[]];
    for (let index = 0; index < 8; index++) {
      rows[index] = [];
    }

    pieces.forEach(piece => {
      LoggingUtils.log(LogLevel.INFO, () => "piece:" + JSON.stringify(piece));
      rows[SquareUtils.rankOf(piece.position)].push(piece);
    });

    rows.reverse();

    return rows
      .map(row => BoardUtils.getRowFen(row))
      .join("/");
  }

  /**
   * Converts an array of pieces into a FEN string representation of a row.
   * @param row - The array of pieces representing a row.
   * @returns The FEN string representation of the row.
   * 
   * @example
   * getRowFen([{type:PieceType.KING, color:Color.WHITE,position:Square.E1}]);
   * // returns "4K3"
   */
  public static getRowFen(row: Piece[]): string {
    let rowFen: string = "";

    let lastColumn: number = 0;

    row.forEach(p => {
      let columnDif: number = SquareUtils.fileOf(p.position) + 1 - lastColumn;
      if (SquareUtils.fileOf(p.position) + 1 - lastColumn > 1) {
        rowFen += columnDif - 1;
      }
      lastColumn = SquareUtils.fileOf(p.position) + 1;
      rowFen += PieceUtils.getPieceFenChar(p.type, p.color);
    });

    if (lastColumn < 8) {
      rowFen += 8 - lastColumn;
    }

    return rowFen;
  }


  public static getCastleRights(board: Board): CastlingRights {
    return board.castlingRights;
  }

  public static getDiagonalPartiallyPinnedMoves(piece: Piece, board: Board, diagonal: Square[]): Move[] | undefined {
    return this.getPartiallyPinnedMoves(piece, board, diagonal, [PieceType.BISHOP, PieceType.QUEEN], true);
  }

  public static getHorizontalPartiallyPinnedMoves(piece: Piece, board: Board, horizontalSquares: Square[]): Move[] | undefined {
    return this.getPartiallyPinnedMoves(piece, board, horizontalSquares, [PieceType.ROOK, PieceType.QUEEN], true);
  }

  public static getVerticalPartiallyPinnedMoves(piece: Piece, board: Board, verticalSquares: Square[]): Move[] | undefined {
    return this.getPartiallyPinnedMoves(piece, board, verticalSquares, [PieceType.ROOK, PieceType.QUEEN], false);
  }

  private static getPartiallyPinnedMoves(piece: Piece, board: Board, orderedSquares: Square[], pinningTypes: PieceType[], orderByColumn: boolean): Move[] | undefined {
    const pieces: Piece[] = orderedSquares.map(p => SquareUtils.getPieceOnPos(board, p)).filter(p => p !== undefined) as Piece[];

    const closestPieces: Piece[] = PieceUtils.sortByDistanceToPiece(piece, pieces);

    let compareLeft: (p: Piece) => boolean;
    let compareRight: (p: Piece) => boolean;
    let filterLeft: (p: Square) => boolean;
    let filterRight: (p: Square) => boolean;

    if (orderByColumn) {
      compareLeft = (p: Piece): boolean => SquareUtils.fileOf(p.position) < SquareUtils.fileOf(piece.position);
      compareRight = (p: Piece): boolean => SquareUtils.fileOf(p.position) > SquareUtils.fileOf(piece.position);
      filterLeft = (p: Square): boolean => SquareUtils.fileOf(p) < SquareUtils.fileOf(piece.position) && SquareUtils.fileOf(p) > SquareUtils.fileOf(closestLeftPiece!.position);
      filterRight = (p: Square): boolean => SquareUtils.fileOf(p) > SquareUtils.fileOf(piece.position) && SquareUtils.fileOf(p) < SquareUtils.fileOf(closestRightPiece!.position);
    }
    else {
      compareLeft = (p: Piece): boolean => SquareUtils.rankOf(p.position) < SquareUtils.rankOf(piece.position);
      compareRight = (p: Piece): boolean => SquareUtils.rankOf(p.position) > SquareUtils.rankOf(piece.position);
      filterLeft = (p: Square): boolean => SquareUtils.rankOf(p) < SquareUtils.rankOf(piece.position) && SquareUtils.rankOf(p) > SquareUtils.rankOf(closestLeftPiece!.position);
      filterRight = (p: Square): boolean => SquareUtils.rankOf(p) > SquareUtils.rankOf(piece.position) && SquareUtils.rankOf(p) < SquareUtils.rankOf(closestRightPiece!.position);
    }

    const closestLeftPiece: Piece | undefined = closestPieces.find(compareLeft);
    const closestRightPiece: Piece | undefined = closestPieces.find(compareRight);

    if (this.isPartiallyPinned(closestLeftPiece, closestRightPiece, piece, pinningTypes) || this.isPartiallyPinned(closestRightPiece, closestLeftPiece, piece, pinningTypes)) {

      const validMoves: Move[] = [];

      const freeFieldsBetweenPieceAndLeftClosestPiece: Square[] = orderedSquares
        .filter(filterLeft);
      const movesToLeft: Move[] = freeFieldsBetweenPieceAndLeftClosestPiece.map(SquareUtils.positionToMoveFunction(piece));
      validMoves.push(...movesToLeft);

      const freeFieldsBetweenPieceAndRightClosestPiece: Square[] = orderedSquares
        .filter(filterRight);
      const movesToRight: Move[] = freeFieldsBetweenPieceAndRightClosestPiece.map(SquareUtils.positionToMoveFunction(piece));
      validMoves.push(...movesToRight);

      return validMoves;
    }
    else {
      return undefined;
    }
  }

  private static isPartiallyPinned(king: Piece | undefined, pinningPiece: Piece | undefined, pinnedPiece: Piece, pinningTypes: PieceType[]) {
    return king
      && king.type === PieceType.KING
      && king.color === pinnedPiece.color
      && pinningPiece
      && pinningPiece.color !== pinnedPiece.color
      && pinningTypes.includes(pinningPiece.type);
  }

  public static getDiagonalPartiallyPinnedCaptures(piece: Piece, board: Board, diagonal: Square[]): Move[] | undefined {
    return this.getPartiallyPinnedCaptures(piece, board, diagonal, [PieceType.BISHOP, PieceType.QUEEN], true);
  }

  public static getHorizontalPartiallyPinnedCaptures(piece: Piece, board: Board, horizontalSquares: Square[]): Move[] | undefined {
    return this.getPartiallyPinnedCaptures(piece, board, horizontalSquares, [PieceType.ROOK, PieceType.QUEEN], true);
  }

  public static getVerticalPartiallyPinnedCaptures(piece: Piece, board: Board, verticalSquares: Square[]): Move[] | undefined {
    return this.getPartiallyPinnedCaptures(piece, board, verticalSquares, [PieceType.ROOK, PieceType.QUEEN], false);
  }

  private static getPartiallyPinnedCaptures(piece: Piece, board: Board, diagonal: Square[], pinningTypes: PieceType[], orderByColumn: boolean): Move[] | undefined {
    const piecesOnDiagonal: Piece[] = diagonal.map(p => SquareUtils.getPieceOnPos(board, p)).filter(p => p !== undefined) as Piece[];

    const closestPieces: Piece[] = PieceUtils.sortByDistanceToPiece(piece, piecesOnDiagonal);

    let compareLeft: (p: Piece) => boolean;
    let compareRight: (p: Piece) => boolean;

    if (orderByColumn) {
      compareLeft = (p: Piece): boolean => SquareUtils.fileOf(p.position) < SquareUtils.fileOf(piece.position);
      compareRight = (p: Piece): boolean => SquareUtils.fileOf(p.position) > SquareUtils.fileOf(piece.position);
    }
    else {
      compareLeft = (p: Piece): boolean => SquareUtils.rankOf(p.position) < SquareUtils.rankOf(piece.position);
      compareRight = (p: Piece): boolean => SquareUtils.rankOf(p.position) > SquareUtils.rankOf(piece.position);
    }

    const closestLeftPiece: Piece | undefined = closestPieces.find(compareLeft);
    const closestRightPiece: Piece | undefined = closestPieces.find(compareRight);

    if (this.isPartiallyPinned(closestLeftPiece, closestRightPiece, piece, pinningTypes) || this.isPartiallyPinned(closestRightPiece, closestLeftPiece, piece, pinningTypes)) {

      const validMoves: Move[] = [];

      // if left piece is an enemy piece, it can be captured
      if (closestLeftPiece && closestLeftPiece.color !== piece.color) {
        validMoves.push(SquareUtils.positionToMoveFunction(piece)(closestLeftPiece.position, 0, [closestLeftPiece.position]));
      }

      // if right piece is an enemy piece, it can be captured
      if (closestRightPiece && closestRightPiece.color !== piece.color) {
        validMoves.push(SquareUtils.positionToMoveFunction(piece)(closestRightPiece.position, 0, [closestRightPiece.position]));
      }

      return validMoves;
    }
    else {
      return undefined;
    }
  }

  public static getColorRepresentation(color: Color): string {
    return color === Color.WHITE ? "WHITE" : "BLACK";
  }

  /**
   * Calculates the distance between two squares on a chessboard.
   * The distance is defined as the maximum difference between the row and column positions of the squares.
   *
   * @param square1 - The first square.
   * @param square2 - The second square.
   * @returns The distance between the two squares.
   */
  public static getDistanceOfSquares(square1: Square, square2: Square): number {
    const pos1 = SquareUtils.convertSquareToPosition(square1);
    const pos2 = SquareUtils.convertSquareToPosition(square2);

    return Math.max(Math.abs(pos1.row - pos2.row), Math.abs(pos1.column - pos2.column));
  }
}