import { Board } from '../types/board.t';
import { Color, Direction, File, PieceType, Rank, Square } from '../types/compressed.types.t';
import { Move, Piece } from '../types/pieces.t';
import SquareUtils, { Position } from './square.utils';

describe('SquareUtils', () => {
  describe('convertPositionToSquare', () => {
    it('should convert position (c: 1, r: 1) to square a1', () => {
      const position: Position = { column: 1, row: 1 };
      const expectedSquare: Square = Square.SQ_A1;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (c: 1, r: 2) to square a2', () => {
      const position: Position = { column: 1, row: 2 };
      const expectedSquare: Square = Square.SQ_A2;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (c:5,r:2) to square e2', () => {
      const position: Position = { column: 5, row: 2 };
      const expectedSquare: Square = Square.SQ_E2;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (c:5,r:3) to square e3', () => {
      const position: Position = { column: 5, row: 3 };
      const expectedSquare: Square = Square.SQ_E3;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (c: 8, r: 1) to square h1', () => {
      const position: Position = { column: 8, row: 1 };
      const expectedSquare: Square = Square.SQ_H1;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });

    it('should convert position (c: 8, r: 8) to square h8', () => {
      const position: Position = { column: 8, row: 8 };
      const expectedSquare: Square = Square.SQ_H8;

      const actualSquare: Square = SquareUtils.convertPositionToSquare(position);

      expect(actualSquare).toEqual(expectedSquare);
    });
  });

  describe('convertSquareToPosition', () => {
    it('should convert square a1 to position (c: 1, r: 1)', () => {
      const square: Square = Square.SQ_A1;
      const expectedPosition: Position = { column: 1, row: 1 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square a2 to position (c: 1, r: 2)', () => {
      const square: Square = Square.SQ_A2;
      const expectedPosition: Position = { column: 1, row: 2 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square e2 to position (c: 5, r: 2)', () => {
      const square: Square = Square.SQ_E2;
      const expectedPosition: Position = { column: 5, row: 2 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square e3 to position (c: 5, r: 3)', () => {
      const square: Square = Square.SQ_E3;
      const expectedPosition: Position = { column: 5, row: 3 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square h1 to position (c: 8, r: 1)', () => {
      const square: Square = Square.SQ_H1;
      const expectedPosition: Position = { column: 8, row: 1 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('should convert square h8 to position (c: 8, r: 8)', () => {
      const square: Square = Square.SQ_H8;
      const expectedPosition: Position = { column: 8, row: 8 };

      const actualPosition: Position = SquareUtils.convertSquareToPosition(square);

      expect(actualPosition).toEqual(expectedPosition);
    });
  });

  describe('getRelativeSquare', () => {
    function testRelativeSquare(square: Square, color: Color, expectedRelativeSquare: Square) {
      const actualRelativeSquare: Square = SquareUtils.getRelativeSquare(square, color);
      expect(actualRelativeSquare).toEqual(expectedRelativeSquare);
    }

    it('should return the relative square for white piece on a1', () => {
      testRelativeSquare(Square.SQ_A1, Color.WHITE, Square.SQ_A1);
    });

    it('should return the relative square for black piece on a1', () => {
      testRelativeSquare(Square.SQ_A1, Color.BLACK, Square.SQ_A8);
    });

    it('should return the relative square for white piece on h8', () => {
      testRelativeSquare(Square.SQ_H8, Color.WHITE, Square.SQ_H8);
    });

    it('should return the relative square for black piece on h8', () => {
      testRelativeSquare(Square.SQ_H8, Color.BLACK, Square.SQ_H1);
    });

    it('should return the relative square for white piece on e5', () => {
      testRelativeSquare(Square.SQ_E5, Color.WHITE, Square.SQ_E5);
    });

    it('should return the relative square for black piece on e5', () => {
      testRelativeSquare(Square.SQ_E5, Color.BLACK, Square.SQ_E4);
    });
  });

  describe('sortSquares', () => {
    it('should sort an array of squares in ascending order', () => {
      const squares: Square[] = [Square.SQ_E4, Square.SQ_A1, Square.SQ_H8, Square.SQ_C3];
      const expectedSortedSquares: Square[] = [Square.SQ_A1, Square.SQ_C3, Square.SQ_E4, Square.SQ_H8];

      const actualSortedSquares: Square[] = SquareUtils.sortSquares(squares);

      expect(actualSortedSquares).toEqual(expectedSortedSquares);
    });
  });

  describe('getSquareRepresentation', () => {
    function testSquareRepresentation(square: Square, expectedRepresentation: string) {
      const actualRepresentation: string | undefined = SquareUtils.getSquareRepresentation(square);
      expect(actualRepresentation).toEqual(expectedRepresentation);
    }

    it('should return the representation of square a1', () => {
      testSquareRepresentation(Square.SQ_A1, "a1");
    });

    it('should return the representation of square e4', () => {
      testSquareRepresentation(Square.SQ_E4, "e4");
    });

    it('should return the representation of square h8', () => {
      testSquareRepresentation(Square.SQ_H8, "h8");
    });
  });

  describe('getSquareFromCoordinate', () => {
    function testSquareFromCoordinate(coordinate: string, expectedSquare: Square) {
      const actualSquare: Square = SquareUtils.getSquareFromCoordinate(coordinate);
      expect(actualSquare).toEqual(expectedSquare);
    }

    it('should return Square.SQ_A1 for coordinate "a1"', () => {
      testSquareFromCoordinate("a1", Square.SQ_A1);
    });

    it('should return Square.SQ_E4 for coordinate "e4"', () => {
      testSquareFromCoordinate("e4", Square.SQ_E4);
    });

    it('should return Square.SQ_H8 for coordinate "h8"', () => {
      testSquareFromCoordinate("h8", Square.SQ_H8);
    });
  });

  describe('compareSquares', () => {
    it('should return a negative number if the first square is smaller than the second square', () => {
      const square1: Square = Square.SQ_A1;
      const square2: Square = Square.SQ_B2;

      const result: number = SquareUtils.compareSquares()(square1, square2);

      expect(result).toBeLessThan(0);
    });

    it('should return a positive number if the first square is larger than the second square', () => {
      const square1: Square = Square.SQ_B2;
      const square2: Square = Square.SQ_A1;

      const result: number = SquareUtils.compareSquares()(square1, square2);

      expect(result).toBeGreaterThan(0);
    });

    it('should return zero if the first square is equal to the second square', () => {
      const square1: Square = Square.SQ_A1;
      const square2: Square = Square.SQ_A1;

      const result: number = SquareUtils.compareSquares()(square1, square2);

      expect(result).toBe(0);
    });
  });

  describe('filterOutAttackedSquares', () => {
    it('should filter out attacked squares around the king', () => {
      const leftMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_D1,
        piece: { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_E1 }
      };

      const leftUpMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_D2,
        piece: { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_E1 }
      };

      const rightMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_F1,
        piece: { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_E1 }
      };

      const rightUpMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_F2,
        piece: { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_E1 }
      };

      const upMove: Move = {
        from: Square.SQ_E1,
        to: Square.SQ_E2,
        piece: { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_E1 }
      };

      expect(SquareUtils.filterOutAttackedSquares([leftMove, leftUpMove, rightMove, rightUpMove, upMove], [Square.SQ_D2, Square.SQ_F2])).toEqual([leftMove, rightMove, upMove]);
    });
  });

  describe('getDiagonalSquaresBetween', () => {
    function testSquaresBetween(squareA: Square, squareB: Square, expectedSquares: Square[]) {
      const actualSquares: Square[] = SquareUtils.getDiagonalSquaresBetween(squareA, squareB);
      expect(actualSquares).toEqual(expectedSquares);
    }

    it('should return an array of squares representing the diagonally between two given positions', () => {
      const squareA: Square = Square.SQ_C3;
      const squareB: Square = Square.SQ_E5;
      const expectedSquares: Square[] = [Square.SQ_D4];

      testSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('should return an empty array if the two positions are not diagonally aligned', () => {
      const squareA: Square = Square.SQ_A1;
      const squareB: Square = Square.SQ_H7;
      const expectedSquares: Square[] = [];

      testSquaresBetween(squareA, squareB, expectedSquares);
    });
  });

  describe('getVerticalSquaresBetween', () => {
    function testVerticalSquaresBetween(squareA: Square, squareB: Square, expectedSquares: Square[]) {
      const actualSquares: Square[] = SquareUtils.getVerticalSquaresBetween(squareA, squareB);
      expect(actualSquares).toEqual(expectedSquares);
    }

    it('should return an array of squares representing the vertical positions between two given squares', () => {
      const squareA: Square = Square.SQ_A1;
      const squareB: Square = Square.SQ_A5;
      const expectedSquares: Square[] = [Square.SQ_A2, Square.SQ_A3, Square.SQ_A4];

      testVerticalSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('should return an empty array if the two squares are in the same row', () => {
      const squareA: Square = Square.SQ_B3;
      const squareB: Square = Square.SQ_E3;
      const expectedSquares: Square[] = [];

      testVerticalSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('should return an empty array if the two squares are not vertically aligned', () => {
      const squareA: Square = Square.SQ_C4;
      const squareB: Square = Square.SQ_E5;
      const expectedSquares: Square[] = [];

      testVerticalSquaresBetween(squareA, squareB, expectedSquares);
    });
  });

  describe('getHorizontalSquaresBetween', () => {
    function testHorizontalSquaresBetween(squareA: Square, squareB: Square, expectedSquares: Square[]) {
      const actualSquares: Square[] = SquareUtils.getHorizontalSquaresBetween(squareA, squareB);
      expect(actualSquares).toEqual(expectedSquares);
    }

    it('should return an array of squares representing the horizontal positions between two given squares', () => {
      const squareA: Square = Square.SQ_A1;
      const squareB: Square = Square.SQ_D1;
      const expectedSquares: Square[] = [Square.SQ_B1, Square.SQ_C1];

      testHorizontalSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('should return an empty array if the two squares are not horizontally aligned', () => {
      const squareA: Square = Square.SQ_A1;
      const squareB: Square = Square.SQ_A2;
      const expectedSquares: Square[] = [];

      testHorizontalSquaresBetween(squareA, squareB, expectedSquares);
    });
  });

  describe('getSquareInDirection', () => {
    it('should return the square in the specified direction from the starting square', () => {
      const square: Square = Square.SQ_E4;

      const upSquare: Square = SquareUtils.getSquareInDirection(square, Direction.NORTH);
      expect(upSquare).toEqual(Square.SQ_E5);

      const downSquare: Square = SquareUtils.getSquareInDirection(square, Direction.SOUTH);
      expect(downSquare).toEqual(Square.SQ_E3);

      const leftSquare: Square = SquareUtils.getSquareInDirection(square, Direction.WEST);
      expect(leftSquare).toEqual(Square.SQ_D4);

      const rightSquare: Square = SquareUtils.getSquareInDirection(square, Direction.EAST);
      expect(rightSquare).toEqual(Square.SQ_F4);

      const upLeftSquare: Square = SquareUtils.getSquareInDirection(square, Direction.NORTH_WEST);
      expect(upLeftSquare).toEqual(Square.SQ_D5);

      const upRightSquare: Square = SquareUtils.getSquareInDirection(square, Direction.NORTH_EAST);
      expect(upRightSquare).toEqual(Square.SQ_F5);

      const downLeftSquare: Square = SquareUtils.getSquareInDirection(square, Direction.SOUTH_WEST);
      expect(downLeftSquare).toEqual(Square.SQ_D3);

      const downRightSquare: Square = SquareUtils.getSquareInDirection(square, Direction.SOUTH_EAST);
      expect(downRightSquare).toEqual(Square.SQ_F3);
    });
  });

  describe('getUpperToLowerDiagonal', () => {
    it('should return a7-g1 diagonals for d4', () => {
      const expectedPositions: Square[] = [
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_D4,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1
      ].sort(SquareUtils.compareSquares());

      const actualPositions: Square[] = SquareUtils.getUpperToLowerDiagonal(Square.SQ_D4).sort(SquareUtils.compareSquares());

      expect(actualPositions).toEqual(expectedPositions);
    });

    it('should return a7-g1 diagonal for b6', () => {
      const expectedPositions: Square[] = [
        Square.SQ_A7,
        Square.SQ_B6,
        Square.SQ_C5,
        Square.SQ_D4,
        Square.SQ_E3,
        Square.SQ_F2,
        Square.SQ_G1
      ].sort(SquareUtils.compareSquares());

      const actualPositions: Square[] = SquareUtils.getUpperToLowerDiagonal(Square.SQ_B6).sort(SquareUtils.compareSquares());

      expect(actualPositions).toEqual(expectedPositions);
    });
  });

  describe('getRelativeDirection', () => {
    function testRelativeDirection(squareA: Square, squareB: Square, expectedDirection: Direction) {
      const actualDirection: Direction = SquareUtils.getRelativeDirection(squareA, squareB);
      expect(actualDirection).toEqual(expectedDirection);
    }

    it('should return Direction.NORTH when squareA is in the same file and squareB is in a higher rank', () => {
      testRelativeDirection(Square.SQ_E4, Square.SQ_E5, Direction.NORTH);
    });

    it('should return Direction.SOUTH when squareA is in the same file and squareB is in a lower rank', () => {
      testRelativeDirection(Square.SQ_E5, Square.SQ_E4, Direction.SOUTH);
    });

    it('should return Direction.EAST when squareA is in the same rank and squareB is in a higher file', () => {
      testRelativeDirection(Square.SQ_E4, Square.SQ_F4, Direction.EAST);
    });

    it('should return Direction.WEST when squareA is in the same rank and squareB is in a lower file', () => {
      testRelativeDirection(Square.SQ_F4, Square.SQ_E4, Direction.WEST);
    });

    it('should return Direction.NORTH_EAST when squareA is in a lower file and lower rank and squareB is in a higher file and higher rank', () => {
      testRelativeDirection(Square.SQ_E4, Square.SQ_F5, Direction.NORTH_EAST);
    });

    it('should return Direction.SOUTH_EAST when squareA is in a lower file and higher rank and squareB is in a higher file and lower rank', () => {
      testRelativeDirection(Square.SQ_E5, Square.SQ_F4, Direction.SOUTH_EAST);
    });

    it('should return Direction.NORTH_WEST when squareA is in a higher file and lower rank and squareB is in a lower file and higher rank', () => {
      testRelativeDirection(Square.SQ_F4, Square.SQ_E5, Direction.NORTH_WEST);
    });

    it('should return Direction.SOUTH_WEST when squareA is in a higher file and higher rank and squareB is in a lower file and lower rank', () => {
      testRelativeDirection(Square.SQ_E5, Square.SQ_D4, Direction.SOUTH_WEST);
    });

    it('should return Direction.NONE when squareA and squareB are the same', () => {
      testRelativeDirection(Square.SQ_E4, Square.SQ_E4, Direction.NONE);
    });
  });

  describe('getLowerToUpperDiagonal', () => {
    it('should return a1-h8 diagonal for d4', () => {
      const expectedPositions: Square[] = [
        Square.SQ_A1,
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_D4,
        Square.SQ_E5,
        Square.SQ_F6,
        Square.SQ_G7,
        Square.SQ_H8
      ].sort(SquareUtils.compareSquares());

      const actualPositions: Square[] = SquareUtils.getLowerToUpperDiagonal(Square.SQ_D4).sort(SquareUtils.compareSquares());

      expect(actualPositions).toEqual(expectedPositions);
    });

    it('should return a5-d8 diagonal for b6', () => {
      const expectedPositions: Square[] = [
        Square.SQ_A5,
        Square.SQ_B6,
        Square.SQ_C7,
        Square.SQ_D8
      ].sort(SquareUtils.compareSquares());

      const actualPositions: Square[] = SquareUtils.getLowerToUpperDiagonal(Square.SQ_B6).sort(SquareUtils.compareSquares());

      expect(actualPositions).toEqual(expectedPositions);
    });
  });

  describe('getVerticalSquares', () => {
    it('should return an array of squares representing the vertical line of the given position', () => {
      const position: Square = Square.SQ_E4;
      const expectedSquares: Square[] = [
        Square.SQ_E1,
        Square.SQ_E2,
        Square.SQ_E3,
        Square.SQ_E4,
        Square.SQ_E5,
        Square.SQ_E6,
        Square.SQ_E7,
        Square.SQ_E8,
      ];

      const actualSquares: Square[] = SquareUtils.getVerticalSquares(position);

      expect(actualSquares).toEqual(expectedSquares);
    });
  });

  describe('getHorizontalSquares', () => {
    it('should return an array of squares representing the horizontal line of the given position', () => {
      const position: Square = Square.SQ_E4;
      const expectedSquares: Square[] = [
        Square.SQ_A4,
        Square.SQ_B4,
        Square.SQ_C4,
        Square.SQ_D4,
        Square.SQ_E4,
        Square.SQ_F4,
        Square.SQ_G4,
        Square.SQ_H4,
      ];

      const actualSquares: Square[] = SquareUtils.getHorizontalSquares(position);

      expect(actualSquares).toEqual(expectedSquares);
    });
  });

  describe('getRowString', () => {
    it('should return the row string of the given square', () => {
      const square: Square = Square.SQ_E4;
      const expectedRowString: string = '4';

      const actualRowString: string = SquareUtils.getRowString(square);

      expect(actualRowString).toEqual(expectedRowString);
    });
  });

  describe('getColumnString', () => {
    function testColumnString(square: Square, expectedColumnString: string) {
      const actualColumnString: string = SquareUtils.getColumnString(square);
      expect(actualColumnString).toEqual(expectedColumnString);
    }

    it('should return "a" for square SQ_A1', () => {
      testColumnString(Square.SQ_A1, 'a');
    });

    it('should return "h" for square SQ_H8', () => {
      testColumnString(Square.SQ_H8, 'h');
    });
  });

  describe('positionToMoveFunction', () => {
    function testPositionToMoveFunction(piece: Piece, square: Square, expectedMove: Move) {
      const moveFunction = SquareUtils.positionToMoveFunction(piece);
      const actualMove: Move = moveFunction(square, 0, []);
      expect(actualMove).toEqual(expectedMove);
    }

    it('should return a move function that converts a square to a move object', () => {
      const piece: Piece = { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_A2 };
      const square: Square = Square.SQ_A3;
      const expectedMove: Move = { piece: piece, from: piece.position, to: square };
      testPositionToMoveFunction(piece, square, expectedMove);
    });

    it('should return a move function that works with different pieces and positions', () => {
      const piece: Piece = { color: Color.BLACK, type: PieceType.KNIGHT, position: Square.SQ_G8 };
      const square: Square = Square.SQ_E7;
      const expectedMove: Move = { piece: piece, from: piece.position, to: square };
      testPositionToMoveFunction(piece, square, expectedMove);
    });
  });

  describe('getPieceOnPos', () => {
    const board: Board = {
      pieces: [
        { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_A2 },
        { color: Color.BLACK, type: PieceType.ROOK, position: Square.SQ_E4 },
        { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_H8 }
      ],
      whiteCastleRights: {
        player: Color.WHITE,
        canShortCastle: false,
        canLongCastle: false
      },
      blackCastleRights: {
        player: Color.WHITE,
        canShortCastle: false,
        canLongCastle: false
      },
      moveCount: 0,
      playerToMove: Color.WHITE
    };

    it('should return the piece located on a specific position on the board', () => {
      const piece1: Piece | undefined = SquareUtils.getPieceOnPos(board, Square.SQ_A2);
      expect(piece1).toEqual({ color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_A2 });

      const piece2: Piece | undefined = SquareUtils.getPieceOnPos(board, Square.SQ_E4);
      expect(piece2).toEqual({ color: Color.BLACK, type: PieceType.ROOK, position: Square.SQ_E4 });

      const piece3: Piece | undefined = SquareUtils.getPieceOnPos(board, Square.SQ_H8);
      expect(piece3).toEqual({ color: Color.WHITE, type: PieceType.KING, position: Square.SQ_H8 });
    });

    it('should return undefined if no piece is found on the specified position', () => {
      const piece: Piece | undefined = SquareUtils.getPieceOnPos(board, Square.SQ_C3);
      expect(piece).toBeUndefined();
    });
  });

  describe('isFree', () => {
    const board: Board = {
      pieces: [
        { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_A2 },
        { color: Color.BLACK, type: PieceType.ROOK, position: Square.SQ_E4 },
        { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_H8 }
      ],
      whiteCastleRights: {
        player: Color.WHITE,
        canShortCastle: false,
        canLongCastle: false
      },
      blackCastleRights: {
        player: Color.WHITE,
        canShortCastle: false,
        canLongCastle: false
      },
      moveCount: 0,
      playerToMove: Color.WHITE
    };

    it('should return true if the square is free', () => {
      const square: Square = Square.SQ_C3;
      const isSquareFree: boolean = SquareUtils.isFree(board, square);

      expect(isSquareFree).toBe(true);
    });

    it('should return false if the square is occupied by a piece', () => {
      const square: Square = Square.SQ_E4;
      const isSquareFree: boolean = SquareUtils.isFree(board, square);

      expect(isSquareFree).toBe(false);
    });
  });

  describe('includes', () => {
    it('should return true if the array includes the square', () => {
      const squares: Square[] = [Square.SQ_A1, Square.SQ_B2, Square.SQ_C3];
      const square: Square = Square.SQ_B2;

      const result: boolean = SquareUtils.includes(squares, square);

      expect(result).toBe(true);
    });

    it('should return false if the array does not include the square', () => {
      const squares: Square[] = [Square.SQ_A1, Square.SQ_B2, Square.SQ_C3];
      const square: Square = Square.SQ_D4;

      const result: boolean = SquareUtils.includes(squares, square);

      expect(result).toBe(false);
    });
  });

  describe('getSurroundingSquares', () => {
    it('should return the correct surrounding squares for a given piece', () => {
      const piece: Piece = {
        position: Square.SQ_E4,
        type: PieceType.KING,
        color: Color.WHITE
      };

      const expectedSquares: Square[] = [
        Square.SQ_D3, Square.SQ_E3, Square.SQ_F3,
        Square.SQ_D4, /* Square.SQ_E4 */ Square.SQ_F4,
        Square.SQ_D5, Square.SQ_E5, Square.SQ_F5,
      ].sort(SquareUtils.compareSquares());

      const surroundingSquares = SquareUtils.getSurroundingSquares(piece).sort(SquareUtils.compareSquares());

      expect(surroundingSquares).toEqual(expectedSquares);
    });

    it('should return the correct surrounding squares for a piece on the edge of the board', () => {
      const piece: Piece = {
        position: Square.SQ_A1,
        type: PieceType.KING,
        color: Color.WHITE
      };

      const expectedSquares: Square[] = [
        /* Square.SQ_A1 */ Square.SQ_B1, Square.SQ_A2,
        Square.SQ_B2
      ].sort(SquareUtils.compareSquares());

      const surroundingSquares = SquareUtils.getSurroundingSquares(piece).sort(SquareUtils.compareSquares());

      expect(surroundingSquares).toEqual(expectedSquares);
    });
  });

  describe('isOnBoard', () => {
    it('should return true for squares on the chessboard', () => {
      expect(SquareUtils.isOnBoard(Square.SQ_A1)).toBe(true);
      expect(SquareUtils.isOnBoard(Square.SQ_E5)).toBe(true);
      expect(SquareUtils.isOnBoard(Square.SQ_H8)).toBe(true);
    });

    it('should return false for squares not on the chessboard', () => {
      expect(SquareUtils.isOnBoard(Square.SQ_NONE)).toBe(false);
      expect(SquareUtils.isOnBoard(Square.SQUARE_NB)).toBe(false);
    });
  });

  describe('squareEquals', () => {
    it('should return true when two squares have the same position', () => {
      const squareA = Square.SQ_A1;
      const squareB = Square.SQ_A1;

      const result = SquareUtils.squareEquals(squareA, squareB);

      expect(result).toBe(true);
    });

    it('should return false when two squares have different positions', () => {
      const squareA = Square.SQ_A1;
      const squareB = Square.SQ_B2;

      const result = SquareUtils.squareEquals(squareA, squareB);

      expect(result).toBe(false);
    });
  });

  describe('fileOf', () => {
    it('should return the correct file for a given square', () => {
      expect(SquareUtils.fileOf(Square.SQ_A1)).toBe(File.FILE_A);
      expect(SquareUtils.fileOf(Square.SQ_A7)).toBe(File.FILE_A);
      expect(SquareUtils.fileOf(Square.SQ_A8)).toBe(File.FILE_A);
      expect(SquareUtils.fileOf(Square.SQ_H1)).toBe(File.FILE_H);
      expect(SquareUtils.fileOf(Square.SQ_H8)).toBe(File.FILE_H);
      expect(SquareUtils.fileOf(Square.SQ_E4)).toBe(File.FILE_E);
    });
  });

  describe('rankOf', () => {
    it('should return the correct rank for a given square', () => {
      expect(SquareUtils.rankOf(Square.SQ_A1)).toBe(Rank.RANK_1);
      expect(SquareUtils.rankOf(Square.SQ_A7)).toBe(Rank.RANK_7);
      expect(SquareUtils.rankOf(Square.SQ_A8)).toBe(Rank.RANK_8);
      expect(SquareUtils.rankOf(Square.SQ_H1)).toBe(Rank.RANK_1);
      expect(SquareUtils.rankOf(Square.SQ_H8)).toBe(Rank.RANK_8);
      expect(SquareUtils.rankOf(Square.SQ_E4)).toBe(Rank.RANK_4);
    });
  });

  describe('getDiagonalSquaresBetween', () => {
    function testDiagonalSquaresBetween(squareA: Square, squareB: Square, expectedSquares: Square[]) {
      const actualSquares = SquareUtils.getDiagonalSquaresBetween(squareA, squareB).sort(SquareUtils.compareSquares());

      expect(actualSquares).withContext(`Expected ${expectedSquares} but got ${actualSquares}.`).toEqual(expectedSquares);
    }

    it('NORTH_EAST - should return the squares between two diagonally aligned squares', () => {
      const squareA = Square.SQ_A1;
      const squareB = Square.SQ_H8;

      const expectedSquares = [
        Square.SQ_B2,
        Square.SQ_C3,
        Square.SQ_D4,
        Square.SQ_E5,
        Square.SQ_F6,
        Square.SQ_G7
      ].sort(SquareUtils.compareSquares());

      testDiagonalSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('NORTH_WEST - should return the squares between two diagonally aligned squares', () => {
      const squareA = Square.SQ_H1;
      const squareB = Square.SQ_A8;

      const expectedSquares = [
        Square.SQ_G2,
        Square.SQ_F3,
        Square.SQ_E4,
        Square.SQ_D5,
        Square.SQ_C6,
        Square.SQ_B7
      ].sort(SquareUtils.compareSquares());

      testDiagonalSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('SOUTH_EAST - should return the squares between two diagonally aligned squares', () => {
      const squareA = Square.SQ_A8;
      const squareB = Square.SQ_H1;

      const expectedSquares = [
        Square.SQ_B7,
        Square.SQ_C6,
        Square.SQ_D5,
        Square.SQ_E4,
        Square.SQ_F3,
        Square.SQ_G2
      ].sort(SquareUtils.compareSquares());

      testDiagonalSquaresBetween(squareA, squareB, expectedSquares);
    });

    it('SOUTH_WEST - should return the squares between two diagonally aligned squares', () => {
      const squareA = Square.SQ_H8;
      const squareB = Square.SQ_A1;

      const expectedSquares = [
        Square.SQ_G7,
        Square.SQ_F6,
        Square.SQ_E5,
        Square.SQ_D4,
        Square.SQ_C3,
        Square.SQ_B2
      ].sort(SquareUtils.compareSquares());

      testDiagonalSquaresBetween(squareA, squareB, expectedSquares);
    });
  });

  describe('onSameDiagonal', () => {
    function testOnSameDiagonal(squareA: Square, squareB: Square, expected: boolean) {
      expect(SquareUtils.onSameDiagonal(squareA, squareB))
        .withContext(`Expected that ${squareA} and ${squareB} are ${expected ? '' : 'not'} on the same diagonal`)
        .toBe(expected);
    }

    it('should return true if two squares are on the same diagonal', () => {
      testOnSameDiagonal(Square.SQ_A1, Square.SQ_H8, true);
      testOnSameDiagonal(Square.SQ_A8, Square.SQ_G2, true);
      testOnSameDiagonal(Square.SQ_G2, Square.SQ_F3, true);
      testOnSameDiagonal(Square.SQ_C5, Square.SQ_F8, true);
    });

    it('should return false if two squares are not on the same diagonal', () => {
      testOnSameDiagonal(Square.SQ_A1, Square.SQ_H1, false);
      testOnSameDiagonal(Square.SQ_A1, Square.SQ_H7, false);
      testOnSameDiagonal(Square.SQ_A1, Square.SQ_B4, false);
      testOnSameDiagonal(Square.SQ_A2, Square.SQ_H8, false);
    });
  });
});