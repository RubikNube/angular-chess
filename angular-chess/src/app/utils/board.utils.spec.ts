import { TestBed } from "@angular/core/testing";
import { Board, Result } from "../types/board.t";
import { Color, Direction, PieceType, Square } from "../types/compressed.types.t";
import { Move, Piece } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import TestUtils from "./test.utils";

describe('BoardUtils', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('isProtected', () => {
    it('should return true if piece is protected by own piece', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/1b6/8/8/8/8/6q1/4K3 w - - 0 1");
      let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: Square.SQ_G2 };

      expect(BoardUtils.isProtected(board, queen))
        .withContext(`Expected that ${JSON.stringify(queen)} is protected on board ${JSON.stringify(board)} but got false.`)
        .toBeTruthy();
    });

    it('should return true if bishop is protected by own king', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4r3/8/8/4k3/4B3/4K3/8/8 b - - 5 1");
      let bishop: Piece = { type: PieceType.BISHOP, color: Color.WHITE, position: Square.SQ_E4 };

      expect(BoardUtils.isProtected(board, bishop)).toBeTruthy();
    });

    it('should return false if piece is not protected by own piece', () => {
      let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/6q1/4K3 w - - 0 1");
      let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: Square.SQ_G2 };

      expect(BoardUtils.isProtected(board, queen)).toBeFalsy();
    });
  });

  describe('getRowFen', () => {
    it('should return correct FEN for single white king', () => {
      const king: Piece = {
        type: PieceType.KING,
        color: Color.WHITE,
        position: Square.SQ_E1
      }
      const row: Piece[] = [king];

      const actualFen = BoardUtils.getRowFen(row);
      expect(actualFen).toEqual("4K3");
    });

    it('should return 8 for empty row', () => {
      const row: Piece[] = [];

      const actualFen = BoardUtils.getRowFen(row);
      expect(actualFen).toEqual("8");
    });
  });

  describe('getPieceFen', () => {
    it('should return piece FEN for starting position', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPieceFen(board);
      expect(actualFen).toEqual("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    });

    it('should return piece FEN for position with two kings', () => {
      const initFen = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPieceFen(board);
      expect(actualFen).toEqual("4k3/8/8/8/8/8/8/4K3");
    });
  });

  describe('getMoveRightFen', () => {
    it('should return FEN for white move right', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveRightFen(board);
      expect(actualFen).toEqual("w");
    });

    it('should return FEN for black move right', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveRightFen(board);
      expect(actualFen).toEqual("b");
    });
  });

  describe('getCastleRightFen', () => {
    it('should return castle right FEN for starting postiion', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("KQkq");
    });

    it('should return - for no castle rights', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("-");
    });

    it('should return KQ for no white castle rights', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("KQ");
    });

    it('should return kq for no black castle rights', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getCastleRightFen(board);
      expect(actualFen).toEqual("kq");
    });
  });

  describe('getEnPassantFen', () => {
    it('should return - for no enPassant square', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getEnPassantFen(board);
      expect(actualFen).toEqual("-");
    });

    it('should return enPassantFen for f6', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq f6 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getEnPassantFen(board);
      expect(actualFen).toEqual("f6");
    });

    it('should return enPassantFen for d6', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq d6 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getEnPassantFen(board);
      expect(actualFen).toEqual("d6");
    });
  });

  describe('getPlyFen', () => {
    it('should return 25 for ply 25', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 25 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPlyFen(board);
      expect(actualFen).toEqual("25");
    });

    it('should return 42 for ply 42', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 42 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getPlyFen(board);
      expect(actualFen).toEqual("42");
    });
  });

  describe('getMoveFen', () => {
    it('should return 25 for move 25', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 25";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveFen(board);
      expect(actualFen).toEqual("25");
    });

    it('should return 42 for move 42', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 42";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getMoveFen(board);
      expect(actualFen).toEqual("42");
    });
  });

  describe('getFen', () => {
    it('should return FEN for starting position', () => {
      const initFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getFen(board);
      expect(actualFen).toEqual(initFen);
    });

    it('should return FEN for position with two kings', () => {
      const initFen = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);

      const actualFen = BoardUtils.getFen(board);
      expect(actualFen).toEqual(initFen);
    });
  });

  describe('calculateMovesThatCapturePiece', () => {
    it('should be able to return many pieces', () => {
      const initFen = "rnb1kbnr/ppp1pppp/8/8/8/5N2/PPPq1PPP/RNBQKB1R w KQkq - 0 1";
      const board: Board = BoardUtils.loadBoardFromFen(initFen);
      let attackingQueen: Piece = {
        color: Color.BLACK,
        type: PieceType.QUEEN,
        position: Square.SQ_D2
      }
      const moveThatCanCapturePiece: Move[] = BoardUtils.calculateMovesThatCapturePiece(board, attackingQueen);
      const expectedNumberOfMoves = 5;

      expect(moveThatCanCapturePiece.length).withContext(`Expectect that ${expectedNumberOfMoves} can capture a piece but got ${moveThatCanCapturePiece.length}. Board: ${JSON.stringify(board)} moveThatCanCapturePiece: ${JSON.stringify(moveThatCanCapturePiece)}`).toEqual(expectedNumberOfMoves);
    });
  });

  describe('loadBoardFromFen', () => {
    it('should load the chess board from a FEN string', () => {
      const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const expectedBoard: Board = {
        result: Result.UNKNOWN,
        pieces: [
          { type: PieceType.ROOK, color: Color.BLACK, position: Square.SQ_A8 },
          { type: PieceType.KNIGHT, color: Color.BLACK, position: Square.SQ_B8 },
          { type: PieceType.BISHOP, color: Color.BLACK, position: Square.SQ_C8 },
          { type: PieceType.QUEEN, color: Color.BLACK, position: Square.SQ_D8 },
          { type: PieceType.KING, color: Color.BLACK, position: Square.SQ_E8 },
          { type: PieceType.BISHOP, color: Color.BLACK, position: Square.SQ_F8 },
          { type: PieceType.KNIGHT, color: Color.BLACK, position: Square.SQ_G8 },
          { type: PieceType.ROOK, color: Color.BLACK, position: Square.SQ_H8 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_A7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_B7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_C7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_D7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_E7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_F7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_G7 },
          { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_H7 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_B2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_C2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_D2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_F2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_G2 },
          { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_H2 },
          { type: PieceType.ROOK, color: Color.WHITE, position: Square.SQ_A1 },
          { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 },
          { type: PieceType.BISHOP, color: Color.WHITE, position: Square.SQ_C1 },
          { type: PieceType.QUEEN, color: Color.WHITE, position: Square.SQ_D1 },
          { type: PieceType.KING, color: Color.WHITE, position: Square.SQ_E1 },
          { type: PieceType.BISHOP, color: Color.WHITE, position: Square.SQ_F1 },
          { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_G1 },
          { type: PieceType.ROOK, color: Color.WHITE, position: Square.SQ_H1 },
        ],
        playerToMove: Color.WHITE,
        whiteCastleRights: { player: Color.WHITE, canShortCastle: true, canLongCastle: true },
        blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
        enPassantSquare: Square.SQ_NONE,
        plyCount: 0,
        moveCount: 1
      };

      const actualBoard = BoardUtils.loadBoardFromFen(fen);

      TestUtils.checkBoards(expectedBoard, actualBoard);
    });
  });

  describe('getFreeSquaresInDirection', () => {
    function testGetFreeSquaresInDirection(board: Board, piece: Piece, direction: number, maxSquares: number, expectedSquares: Square[]) {
      const result = BoardUtils.getFreeSquaresInDirection(board, piece, direction, maxSquares);
      expect(result).withContext(`Expected ${expectedSquares} but got ${result}`).toEqual(expectedSquares);
    }

    it('NORTH - should return an empty array if the maxSquares is 0', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 };
      const direction = Direction.NORTH;
      const maxSquares = 0;
      const expectedSquares: Square[] = [];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('NORTH - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 };
      const direction = Direction.NORTH;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_E3, Square.SQ_E4];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('NORTH - should return the correct squares when there is an obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/p7/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A2 };
      const direction = Direction.NORTH;
      const maxSquares = 3;
      const expectedSquares: Square[] = [Square.SQ_A3, Square.SQ_A4];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('NORTH - should return the correct squares when the maxSquares is greater than the available squares', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_H2 };
      const direction = Direction.NORTH;
      const maxSquares = 8;
      const expectedSquares: Square[] = [Square.SQ_H3, Square.SQ_H4, Square.SQ_H5, Square.SQ_H6, Square.SQ_H7, Square.SQ_H8];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('NORTH_EAST - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A1 };
      const direction = Direction.NORTH_EAST;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_B2, Square.SQ_C3];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('NORTH_WEAST - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_H1 };
      const direction = Direction.NORTH_WEST;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_G2, Square.SQ_F3];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('SOUTH_EAST - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A8 };
      const direction = Direction.SOUTH_EAST;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_B7, Square.SQ_C6];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('SOUTH_WEST - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_H8 };
      const direction = Direction.SOUTH_WEST;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_G7, Square.SQ_F6];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('SOUTH - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E7 };
      const direction = Direction.SOUTH;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_E6, Square.SQ_E5];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('EAST - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A1 };
      const direction = Direction.EAST;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_B1, Square.SQ_C1];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });

    it('WEST - should return the correct squares when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_H1 };
      const direction = Direction.WEST;
      const maxSquares = 2;
      const expectedSquares: Square[] = [Square.SQ_G1, Square.SQ_F1];

      testGetFreeSquaresInDirection(board, piece, direction, maxSquares, expectedSquares);
    });
  });

  describe('getOccupiedSquareInDirection', () => {
    function testGetOccupiedSquares(board: Board, piece: Piece, direction: number, maxSquares: number, expectedSquares: Square[]) {
      const actualSquares = BoardUtils.getOccupiedSquareInDirection(board, piece, direction, maxSquares);
      expect(actualSquares).withContext(`Expected ${expectedSquares} but got ${actualSquares} on board ${JSON.stringify(board)}`).toEqual(expectedSquares);
    }

    it('SOUTH - should return the correct no square when there are no obstacles', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 };
      const direction = Direction.SOUTH;
      const expectedSquares: Square[] = [];

      testGetOccupiedSquares(board, piece, direction, 1, expectedSquares);
    });

    it('SOUTH - should return the correct occupied square when there is a direct obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/p7 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A2 };
      const direction = Direction.SOUTH;
      const expectedSquares: Square[] = [Square.SQ_A1];

      testGetOccupiedSquares(board, piece, direction, 1, expectedSquares);
    });

    it('SOUTH - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/p7 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A5 };
      const direction = Direction.SOUTH;
      const expectedSquares: Square[] = [Square.SQ_A1];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('SOUTH - should return the no occupied square when the obstacle is out of range', () => {
      const board: Board
        = BoardUtils.loadBoardFromFen("8/8/8/8/8/8/8/p7 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_A5 };
      const direction = Direction.SOUTH;
      const expectedSquares: Square[] = [];

      testGetOccupiedSquares(board, piece, direction, 3, expectedSquares);
    });

    it('SOUTH_EAST - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_C5 };
      const direction = Direction.SOUTH_EAST;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('SOUTH_WEST - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_G5 };
      const direction = Direction.SOUTH_WEST;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('NORTH_EAST - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_C1 };
      const direction = Direction.NORTH_EAST;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('NORTH_WEST - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_G1 };
      const direction = Direction.NORTH_WEST;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('NORTH - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E1 };
      const direction = Direction.NORTH;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('EAST - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_C3 };
      const direction = Direction.EAST;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('EAST - should return no square if no obstacle is on the same rank', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/k7/4R3/8/8/8/2K5 w - - 0 1");
      const piece: Piece = { type: PieceType.ROOK, color: Color.WHITE, position: Square.SQ_E5 };
      const direction = Direction.EAST;
      const expectedSquares: Square[] = [];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });

    it('WEST - should return the correct occupied square when there is a distant obstacle', () => {
      const board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/8/4p3/8/8 w - - 0 1");
      const piece: Piece = { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_G3 };
      const direction = Direction.WEST;
      const expectedSquares: Square[] = [Square.SQ_E3];

      testGetOccupiedSquares(board, piece, direction, 8, expectedSquares);
    });
  });
});