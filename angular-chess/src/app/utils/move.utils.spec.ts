import { Color, PieceType, Square } from "../types/compressed.types.t";
import MoveUtils, { MoveRepresentationConfig } from "./move.utils";

describe('MoveUtils', () => {
  describe('getSimpleMoveRepresentation', () => {
    it('should return "e4" for "e2-e4"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E2,
        to: Square.SQ_E4,
        piece: { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 }
      });

      expect(moveRepr).toEqual("e4");
    });

    it('should return "e4+" for "e2-e4+"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E2,
        to: Square.SQ_E4,
        piece: { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 },
        isCheck: true
      });

      expect(moveRepr).toEqual("e4+");
    });

    it('should return "e4#" for "e2-e4#"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E2,
        to: Square.SQ_E4,
        piece: { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 },
        isCheck: true,
        isMate: true
      });

      expect(moveRepr).toEqual("e4#");
    });

    it('should return "exd5" for "exd5"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E4,
        to: Square.SQ_D5,
        piece: { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E4 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_D5 }
      });

      expect(moveRepr).toEqual("exd5");
    });

    it('should return "" for undefined move', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation(undefined);

      expect(moveRepr).toEqual("");
    });

    it('should return "e3" for "e2-e3"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E2,
        to: Square.SQ_E3,
        piece: { type: PieceType.PAWN, color: Color.WHITE, position: Square.SQ_E2 }
      });

      expect(moveRepr).toEqual("e3");
    });

    it('should return "Nc3" for "Nb1-c3"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 }
      });

      expect(moveRepr).toEqual("Nc3");
    });

    it('should return "Nbc3" for "Nb1-c3" with include from column', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 }
      }, MoveRepresentationConfig.INCLUDE_FROM_COLUMN);

      expect(moveRepr).toEqual("Nbc3");
    });

    it('should return "N1c3" for "Nb1-c3" with include from row', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 }
      }, MoveRepresentationConfig.INCLUDE_FROM_ROW);

      expect(moveRepr).toEqual("N1c3");
    });

    it('should return "Nxc3" for "Nb1xc3"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_C3 }
      });

      expect(moveRepr).toEqual("Nxc3");
    });

    it('should return "Nbxc3" for "Nb1xc3"  with include from column', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_C3 }
      }, MoveRepresentationConfig.INCLUDE_FROM_COLUMN);

      expect(moveRepr).toEqual("Nbxc3");
    });

    it('should return "N1xc3" for "Nb1xc3"  with include from row', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_C3,
        piece: { type: PieceType.KNIGHT, color: Color.WHITE, position: Square.SQ_B1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_C3 }
      }, MoveRepresentationConfig.INCLUDE_FROM_ROW);

      expect(moveRepr).toEqual("N1xc3");
    });

    it('should return "Qa8" for "Qa1-a8"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_A1,
        to: Square.SQ_A8,
        piece: { type: PieceType.QUEEN, color: Color.WHITE, position: Square.SQ_A1 }
      });

      expect(moveRepr).toEqual("Qa8");
    });

    it('should return "Qxa8" for "Qa1xa8"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_A1,
        to: Square.SQ_A8,
        piece: { type: PieceType.QUEEN, color: Color.WHITE, position: Square.SQ_A1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_A8 }
      });

      expect(moveRepr).toEqual("Qxa8");
    });

    it('should return "Ra8" for "Ra1-a8"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_A1,
        to: Square.SQ_A8,
        piece: { type: PieceType.ROOK, color: Color.WHITE, position: Square.SQ_A1 }
      });

      expect(moveRepr).toEqual("Ra8");
    });

    it('should return "Rxa8" for "Ra1xa8"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_A1,
        to: Square.SQ_A8,
        piece: { type: PieceType.ROOK, color: Color.WHITE, position: Square.SQ_A1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_A8 }
      });

      expect(moveRepr).toEqual("Rxa8");
    });

    it('should return "Ka2" for "Ka1-a2"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_A1,
        to: Square.SQ_A2,
        piece: { type: PieceType.KING, color: Color.WHITE, position: Square.SQ_A1 }
      });

      expect(moveRepr).toEqual("Ka2");
    });

    it('should return "Kxa2" for "Ka1xa2"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_A1,
        to: Square.SQ_A2,
        piece: { type: PieceType.KING, color: Color.WHITE, position: Square.SQ_A1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_A2 }
      });

      expect(moveRepr).toEqual("Kxa2");
    });

    it('should return "Ba2" for "Bb1-a2"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_A2,
        piece: { type: PieceType.BISHOP, color: Color.WHITE, position: Square.SQ_B1 }
      });

      expect(moveRepr).toEqual("Ba2");
    });

    it('should return "Bxa2" for "Bb1xa2"', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_B1,
        to: Square.SQ_A2,
        piece: { type: PieceType.BISHOP, color: Color.WHITE, position: Square.SQ_B1 },
        capturedPiece: { type: PieceType.PAWN, color: Color.BLACK, position: Square.SQ_A2 }
      });

      expect(moveRepr).toEqual("Bxa2");
    });

    it('should return "O-O" for short castle', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E1,
        to: Square.SQ_G1,
        isShortCastle: true,
        piece: { type: PieceType.KING, color: Color.WHITE, position: Square.SQ_E1 }
      });

      expect(moveRepr).toEqual("O-O");
    });

    it('should return "O-O-O" for long castle', () => {
      const moveRepr = MoveUtils.getSimpleMoveRepresentation({
        from: Square.SQ_E1,
        to: Square.SQ_C1,
        isLongCastle: true,
        piece: { type: PieceType.KING, color: Color.WHITE, position: Square.SQ_E1 }
      });

      expect(moveRepr).toEqual("O-O-O");
    });
  });
});