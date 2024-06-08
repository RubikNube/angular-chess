import { assert } from "console";

export enum Color {
  WHITE,
  BLACK,
  COLOR_NB = 2
};

export enum CastlingRights {
  NO_CASTLING,
  WHITE_OO,
  WHITE_OOO = WHITE_OO << 1,
  BLACK_OO = WHITE_OO << 2,
  BLACK_OOO = WHITE_OO << 3,

  KING_SIDE = WHITE_OO | BLACK_OO,
  QUEEN_SIDE = WHITE_OOO | BLACK_OOO,
  WHITE_CASTLING = WHITE_OO | WHITE_OOO,
  BLACK_CASTLING = BLACK_OO | BLACK_OOO,
  ANY_CASTLING = WHITE_CASTLING | BLACK_CASTLING,

  CASTLING_RIGHT_NB = 16
};

export enum Bound {
  BOUND_NONE,
  BOUND_UPPER,
  BOUND_LOWER,
  BOUND_EXACT = BOUND_UPPER | BOUND_LOWER
};

export enum PieceType {
  NO_PIECE_TYPE, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING,
  ALL_PIECES = 0,
  PIECE_TYPE_NB = 8
};

export enum Piece {
  NO_PIECE,
  W_PAWN = PieceType.PAWN, W_KNIGHT, W_BISHOP, W_ROOK, W_QUEEN, W_KING,
  B_PAWN = PieceType.PAWN + 8, B_KNIGHT, B_BISHOP, B_ROOK, B_QUEEN, B_KING,
  PIECE_NB = 16
}

export enum Square {
  SQ_A1, SQ_B1, SQ_C1, SQ_D1, SQ_E1, SQ_F1, SQ_G1, SQ_H1,
  SQ_A2, SQ_B2, SQ_C2, SQ_D2, SQ_E2, SQ_F2, SQ_G2, SQ_H2,
  SQ_A3, SQ_B3, SQ_C3, SQ_D3, SQ_E3, SQ_F3, SQ_G3, SQ_H3,
  SQ_A4, SQ_B4, SQ_C4, SQ_D4, SQ_E4, SQ_F4, SQ_G4, SQ_H4,
  SQ_A5, SQ_B5, SQ_C5, SQ_D5, SQ_E5, SQ_F5, SQ_G5, SQ_H5,
  SQ_A6, SQ_B6, SQ_C6, SQ_D6, SQ_E6, SQ_F6, SQ_G6, SQ_H6,
  SQ_A7, SQ_B7, SQ_C7, SQ_D7, SQ_E7, SQ_F7, SQ_G7, SQ_H7,
  SQ_A8, SQ_B8, SQ_C8, SQ_D8, SQ_E8, SQ_F8, SQ_G8, SQ_H8,
  SQ_NONE,

  SQUARE_ZERO = 0,
  SQUARE_NB = 64
}

export enum Direction {
  NORTH = 8,
  EAST = 1,
  SOUTH = -NORTH,
  WEST = -EAST,

  NORTH_EAST = NORTH + EAST,
  SOUTH_EAST = SOUTH + EAST,
  SOUTH_WEST = SOUTH + WEST,
  NORTH_WEST = NORTH + WEST,
  NONE = 42
}

export enum File {
  FILE_A,
  FILE_B,
  FILE_C,
  FILE_D,
  FILE_E,
  FILE_F,
  FILE_G,
  FILE_H,
  FILE_NB
}

export enum Rank {
  RANK_1,
  RANK_2,
  RANK_3,
  RANK_4,
  RANK_5,
  RANK_6,
  RANK_7,
  RANK_8,
  RANK_NB
}

type Key = number;
type Bitboard = number;

/**  Value is used as an alias for int16_t, this is done to differentiate between
  a search value and any other integer value. The values used in search are always
supposed to be in the range (-VALUE_NONE, VALUE_NONE] and should not exceed this range.
**/
type Value = number;
export const VALUE_NONE: number = 32002;

/**
 * Represents a dirty piece, which is a piece that has changed during a move.
 */
interface DirtyPiece {
  dirty_num: number;
  /**
   * Max 3 pieces can change in one move. A promotion with capture moves
   * both the pawn and the captured piece to SQ_NONE and the piece promoted
   * to from SQ_NONE to the capture square.
   */
  piece: Piece[];
  /**
   * From and to squares, which may be SQ_NONE.
   */
  from: Square[];
  to: Square[];
}

/**
 * Represents the state information of a chess game.
 */
export interface StateInfo {
  materialKey: Key;
  pawnKey: Key;
  nonPawnMaterial: Value[];
  castlingRights: number;
  rule50: number;
  pliesFromNull: number;
  epSquare: Square;
  key: Key;
  checkersBB: Bitboard;
  previous: StateInfo | null;
  blockersForKing: Bitboard[];
  pinners: Bitboard[];
  checkSquares: Bitboard[];
  capturedPiece: Piece;
  repetition: number;
  dirtyPiece: DirtyPiece;
}

/**
 * Represents the type of a chess move.
 */
export enum MoveType {
  NORMAL,
  PROMOTION = 1 << 14,
  EN_PASSANT = 2 << 14,
  CASTLING = 3 << 14
};

/**
 * A move needs 16 bits to be stored
 * 
 * bit  0- 5: destination square (from 0 to 63)
 * 
 * bit  6-11: origin square (from 0 to 63)
 * 
 * bit 12-13: promotion piece type - 2 (from KNIGHT-2 to QUEEN-2)
 * 
 * bit 14-15: special move flag: promotion (1), en passant (2), castling (3)
 * 
 * NOTE: en passant bit is set only when a pawn can be captured
 * Special cases are Move::none() and Move::null(). We can sneak these in because in
 * any normal move destination square is always different from origin square
 * while Move::none() and Move::null() have the same origin and destination square.
 */
export class Move {
  private data: number;

  constructor(data: number);
  constructor(from: Square, to: Square);
  constructor(dataOrFrom: number | Square, to?: Square) {
    if (typeof dataOrFrom === 'number') {
      this.data = dataOrFrom;
    } else {
      const from = dataOrFrom;
      this.data = (from << 6) + to!;
    }
  }

  public static make(from: Square, to: Square, pieceType: PieceType = PieceType.KNIGHT, moveType: MoveType = MoveType.NORMAL): Move {
    return new Move(moveType + ((pieceType - PieceType.KNIGHT) << 12) + (from << 6) + to);
  }

  /**
   * Gets the square from which the move is made.
   * @returns The source square.
   */
  public fromSquare(): Square {
    assert(this.isOk());
    return (this.data >> 6 & 0x3F) as Square;
  }

  /**
   * Gets the square to which the move is made.
   * @returns The destination square.
   */
  public toSquare(): Square {
    assert(this.isOk());
    return (this.data & 0x3F) as Square;
  }

  /**
   * Gets the combined value of the source and destination squares.
   * @returns The combined value.
   */
  public fromTo(): number {
    return this.data & 0xFFF;
  }

  /**
   * Gets the type of the move.
   * @returns The move type.
   */
  public typeof(): MoveType {
    return (this.data & (3 << 14)) as MoveType;
  }

  /**
   * Gets the type of the piece after promotion (if any).
   * @returns The piece type.
   */
  public promotionType(): PieceType {
    return ((this.data >> 12 & 3) + PieceType.KNIGHT) as PieceType;
  }

  /**
   * Checks if the move is a promotion.
   * @returns A boolean value indicating whether the move is a promotion.
   */
  public isPromotion(): boolean {
    return this.typeof() == MoveType.PROMOTION;
  }

  /**
   * Checks if the move is valid.
   * @returns True if the move is valid, false otherwise.
   */
  public isOk(): boolean {
    return this.none().data != this.data && this.null().data != this.data;
  }

  /**
   * Returns a null move.
   * @returns The null move.
   */
  public null(): Move {
    return new Move(65);
  }


  /**
   * Returns a none move.
   * @returns The none move.
   */
  public none(): Move {
    return new Move(0);
  }

  /**
   * Checks if the move is equal to another move.
   * @param move - The move to compare.
   * @returns True if the moves are equal, false otherwise.
   */
  public equals(move: Move): boolean {
    return this.data == move.data;
  }

  /**
   * Checks if the move is not equal to another move.
   * @param move - The move to compare.
   * @returns True if the moves are not equal, false otherwise.
   */
  public notEquals(move: Move): boolean {
    return this.data != move.data;
  }

  /**
   * Converts the move to a boolean value.
   * @returns True if the move is valid, false otherwise.
   */
  public toBoolean(): boolean {
    return this.data != 0;
  }

  /**
   * Gets the raw value of the move.
   * @returns The raw value.
   */
  public raw(): number {
    return this.data;
  }

  /**
   * Checks if the move is an en passant move.
   * @returns {boolean} True if the move is an en passant move, false otherwise.
   */
  public isEnPassant(): boolean {
    return this.typeof() == MoveType.EN_PASSANT;
  }

  /**
   * Gets the hash value of the move.
   * @returns The hash value.
   */
  public hash(): number {
    return this.data * 31; // Using a prime number for hashing
  }
}

