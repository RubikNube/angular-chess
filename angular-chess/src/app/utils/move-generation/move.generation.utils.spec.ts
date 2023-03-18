import { Board, Color } from 'src/app/types/board.t';
import { Move, Piece, PieceType } from 'src/app/types/pieces.t';
import BoardUtils from '../board.utils';
import MoveGenerationUtils from './move.generation.utils';


describe('MoveGenerationUtils', () => {

  describe('getExecutableMove', () => {
    it('should return valid kingside castle', () => {
      let board: Board = BoardUtils.loadBoardFromFen("r1b1kb1r/pp1nqpp1/2p1Nn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 1 9");
      let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
      let validMoves = MoveGenerationUtils.getExecutableMove(board, king, { column: 7, row: 1 });

      expect(validMoves).toEqual({ piece: king, from: { column: 5, row: 1 }, to: { column: 7, row: 1 }, isCheck: false, isShortCastle: true })
    });
  });

  describe('getValidMoves', () => {
    describe('for pawn', () => {
      it('should generate white pawn moves for one and two squares', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/4p3/8/8/8/8/4P3/4K3 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 2 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        expect(validMoves.length).toEqual(2);
        expect(validMoves[0]).toEqual({ piece: pawn, from: { column: 5, row: 2 }, to: { column: 5, row: 3 }, isCheck: false })
        expect(validMoves[1]).toEqual({ piece: pawn, from: { column: 5, row: 2 }, to: { column: 5, row: 4 }, isCheck: false })
      });

      it('should generate black pawn moves for one and two squares', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/4p3/8/8/8/8/4P3/4K3 b - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 7 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        expect(validMoves.length).toEqual(2);
        expect(validMoves[0]).toEqual({ piece: pawn, from: { column: 5, row: 7 }, to: { column: 5, row: 6 }, isCheck: false })
        expect(validMoves[1]).toEqual({ piece: pawn, from: { column: 5, row: 7 }, to: { column: 5, row: 5 }, isCheck: false })
      });

      it('should not generate move when pawn is pinned diagonally', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3k4/4p3/8/8/7B/8/8/3K4 b - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 7 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when pawn is pinned horizontally from right side', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/3K1P1r/8 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 6, row: 2 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when pawn is pinned horizontally from left side', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/r1P1K3/8 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 3, row: 2 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        expect(validMoves).toEqual([]);
      });

      // 
      it('should generate move that blocks diagonal check', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7k/qrp3p1/2Qp3p/PP1Pp1bn/5p2/5P2/6PP/1RBR2K1 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 2, row: 5 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        let expectedMoves: Move[] = [
          { piece: pawn, from: { column: 2, row: 5 }, to: { column: 2, row: 6 }, isCheck: false }
        ];

        expect(validMoves).toEqual(expectedMoves);
      });
    });

    describe('for king', () => {
      it('should generate white king short castle', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).toContain({
          piece: king,
          from: { column: 5, row: 1 },
          to: { column: 7, row: 1 },
          isCheck: false,
          isShortCastle: true
        });
      });

      it('should not generate white king short castle when f1 is attacked', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4kr2/8/8/8/8/8/8/R3K2R w KQ - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).not.toContain({
          piece: king,
          from: { column: 5, row: 1 },
          to: { column: 7, row: 1 },
          isCheck: false,
          isShortCastle: true
        });
      });

      it('should generate white king long castle', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).toContain({
          piece: king,
          from: { column: 5, row: 1 },
          to: { column: 3, row: 1 },
          isCheck: false,
          isLongCastle: true
        });
      });

      it('should not generate white king long castle when d1 is attacked', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3rk3/8/8/8/8/8/8/R3K2R w KQ - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).not.toContain({
          piece: king,
          from: { column: 5, row: 1 },
          to: { column: 3, row: 1 },
          isCheck: false,
          isLongCastle: true
        });
      });

      it('should generate black king short castle', () => {
        let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).toContain({
          piece: king,
          from: { column: 5, row: 8 },
          to: { column: 7, row: 8 },
          isCheck: false,
          isShortCastle: true
        });
      });

      it('should generate black king long castle', () => {
        let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).toContain({
          piece: king,
          from: { column: 5, row: 8 },
          to: { column: 3, row: 8 },
          isCheck: false,
          isLongCastle: true
        });
      });

      it('should not generate black king short castle if f8 is attacked', () => {
        let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/4KR2 b - - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).not.toContain({
          piece: king,
          from: { column: 5, row: 8 },
          to: { column: 7, row: 8 },
          isCheck: false,
          isShortCastle: true
        });
      });

      it('should not generate black king long castle if d8 is attacked', () => {
        let board: Board = BoardUtils.loadBoardFromFen("r3k2r/8/8/8/8/8/8/3RK3 b - - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 8 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).not.toContain({
          piece: king,
          from: { column: 5, row: 8 },
          to: { column: 3, row: 8 },
          isCheck: false,
          isLongCastle: true
        });
      });

      it('should not generate squares for the king that are attacked by pawn or blocked by an own piece', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2b1kbnr/6pp/P7/3q1p2/R1pP1P2/2P1p3/1BQ1P1PP/4KBNR w - - 0 0");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, king, true);

        expect(validMoves).toEqual([{ piece: king, from: { column: 5, row: 1 }, to: { column: 4, row: 1 }, isCheck: false }]);
      });
    });

    describe('for bishop', () => {

      it('should not generate move when bishop is pinned horizontally from right side', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/3K1B1r/8 w - - 0 1");
        let pawn: Piece = { type: PieceType.BISHOP, position: { column: 6, row: 2 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, pawn, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when bishop is pinned horizontally from left side', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/8/8/r1B1K3/8 w - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 3, row: 2 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, bishop, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when bishop is pinned vertically from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3r4/8/3B4/8/3K2k1/8/8/8 w - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 4, row: 6 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, bishop, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate limited moves when bishop is partially pinned from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7B/8/8/4b3/8/2k5/8/K7 b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 5, row: 5 }, color: Color.BLACK };
        let expectedMoves = [
          { piece: bishop, from: { column: 5, row: 5 }, to: { column: 4, row: 4 }, isCheck: false },
          { piece: bishop, from: { column: 5, row: 5 }, to: { column: 6, row: 6 }, isCheck: false },
          { piece: bishop, from: { column: 5, row: 5 }, to: { column: 7, row: 7 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, bishop, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when bishop is partially pinned from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("B7/8/8/3b4/8/5k2/8/7K b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 4, row: 5 }, color: Color.BLACK };
        let expectedMoves = [
          { piece: bishop, from: { column: 4, row: 5 }, to: { column: 2, row: 7 }, isCheck: false },
          { piece: bishop, from: { column: 4, row: 5 }, to: { column: 3, row: 6 }, isCheck: false },
          { piece: bishop, from: { column: 4, row: 5 }, to: { column: 5, row: 4 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, bishop, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when bishop is partially pinned from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/8/5k2/8/8/2b5/8/B7 b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 3, row: 3 }, color: Color.BLACK };
        let expectedMoves = [
          { piece: bishop, from: { column: 3, row: 3 }, to: { column: 2, row: 2 }, isCheck: false },
          { piece: bishop, from: { column: 3, row: 3 }, to: { column: 4, row: 4 }, isCheck: false },
          { piece: bishop, from: { column: 3, row: 3 }, to: { column: 5, row: 5 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, bishop, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when bishop is partially pinned from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K7/8/2k5/8/8/5b2/8/7B b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 6, row: 3 }, color: Color.BLACK };
        let expectedMoves = [
          { piece: bishop, from: { column: 6, row: 3 }, to: { column: 4, row: 5 }, isCheck: false },
          { piece: bishop, from: { column: 6, row: 3 }, to: { column: 5, row: 4 }, isCheck: false },
          { piece: bishop, from: { column: 6, row: 3 }, to: { column: 7, row: 2 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, bishop, true);

        expect(validMoves).toEqual(expectedMoves);
      });
    });

    describe('for rook', () => {

      it('should not generate move when rook is pinned diagonally pinned from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("B7/8/2r5/8/4k3/1K6/8/8 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 3, row: 6 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when rook is pinned diagonally pinned from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7B/8/5r2/4k3/8/2K5/8/8 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 6, row: 6 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when rook is pinned diagonally pinned from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/4k1K1/8/2r5/8/B7 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 3, row: 3 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual([]);
      });

      it('should not generate move when rook is pinned diagonally pinned from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/3k4/1K6/5r2/8/7B b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 6, row: 3 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate limited moves when rook is partially pinned from right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/k1r3R1/8/8/5K2 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 3, row: 4 }, color: Color.BLACK };

        let expectedMoves = [
          { piece: rook, from: { column: 3, row: 4 }, to: { column: 2, row: 4 }, isCheck: false },
          { piece: rook, from: { column: 3, row: 4 }, to: { column: 4, row: 4 }, isCheck: false },
          { piece: rook, from: { column: 3, row: 4 }, to: { column: 5, row: 4 }, isCheck: false },
          { piece: rook, from: { column: 3, row: 4 }, to: { column: 6, row: 4 }, isCheck: true }
        ];
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when rook is partially pinned from left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/1R1r2k1/8/8/K7 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };

        let expectedMoves = [
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 3, row: 4 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 5, row: 4 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 6, row: 4 }, isCheck: false }
        ];
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when rook is partially pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3R4/8/8/3r4/8/8/K2k4 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };

        let expectedMoves = [
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 2 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 3 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 5 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 6 }, isCheck: false }
        ];
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when rook is partially pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/K2k4/8/8/3r4/8/8/3R4 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };

        let expectedMoves = [
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 2 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 3 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 5 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 4 }, to: { column: 4, row: 6 }, isCheck: false }
        ];
        let validMoves = MoveGenerationUtils.getValidMoves(board, rook, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate rook moves when same colored rook is "pinning" it', () => {
        let board: Board = BoardUtils.loadBoardFromFen("r4rk1/p1q2ppp/1p2pb2/2n5/2B5/2P1BQ1P/PP3PP1/R2R2K1 w - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 1 }, color: Color.WHITE };
        const compareColumns = (a: Move, b: Move): number => a.to.column - b.to.column;
        let expectedCaptures: Move[] = [
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 2, row: 1 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 3, row: 1 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 5, row: 1 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 6, row: 1 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 2 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 3 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 4 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 5 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 6 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 7 }, isCheck: false },
          { piece: rook, from: { column: 4, row: 1 }, to: { column: 4, row: 8 }, isCheck: false }
        ].sort(compareColumns);
        let validCaptures = MoveGenerationUtils.getValidMoves(board, rook, true).sort(compareColumns);

        expect(validCaptures).toEqual(expectedCaptures);
      });
    });

    describe('for knight', () => {

      it('should generate no moves when knight is pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3R4/8/8/8/3n3K/8/3k4/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 4 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3k4/8/8/3n3K/8/3R4/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 4 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is pinned from right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/k2n2R1/8/3K4/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 4 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is pinned from left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/8/R2n2k1/8/3K4/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 4 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is diagonally pinned from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/1B6/8/3n4/8/1K3k2/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 4 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is diagonally pinned from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/5B2/8/3n1K2/8/1k6/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 4 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is diagonally pinned from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/5k2/8/3n1K2/8/1B6/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves when knight is diagonally pinned from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/1k6/8/3n1K2/8/5B2/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };

        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });

      it('should generate no moves if king is in check after move', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3k4/8/8/8/8/8/2N2q2/4K3 w - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 3, row: 2 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidMoves(board, knight, true);

        expect(validMoves).toEqual([]);
      });
    });

    describe('for queen', () => {

      it('should generate limited moves when queen is pinned from left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K2N4/8/8/8/1R1q3k/8/8/3N4 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 3, row: 4 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 5, row: 4 }, isCheck: true },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 6, row: 4 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 7, row: 4 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned from right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K2N4/8/8/8/1k1q3R/8/8/3N4 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 3, row: 4 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 5, row: 4 }, isCheck: true },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 6, row: 4 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 7, row: 4 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K7/3R4/8/8/3q4/8/8/3k4 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 2 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 3 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 5 }, isCheck: true },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 6 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K7/3k4/8/8/3q4/8/8/3R4 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 2 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 3 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 5 }, isCheck: true },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 6 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned diagonally from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K7/8/1k6/8/3q4/8/8/6B1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 3, row: 5 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 5, row: 3 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 6, row: 2 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned diagonally from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K7/8/5k2/8/3q4/8/8/B7 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 2, row: 2 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 3, row: 3 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 5, row: 5 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned diagonally from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/B7/8/8/3q4/8/5k2/7K b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 2, row: 6 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 3, row: 5 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 5, row: 3 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });

      it('should generate limited moves when queen is pinned diagonally from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/6B1/8/8/3q4/8/1k6/7K b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedMoves: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 3, row: 3 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 5, row: 5 }, isCheck: false },
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 6, row: 6 }, isCheck: false }
        ];

        let validMoves = MoveGenerationUtils.getValidMoves(board, queen, true);

        expect(validMoves).toEqual(expectedMoves);
      });
    });
  });

  describe('getValidCaptures', () => {
    describe('for pawn', () => {
      it('should generate white pawn captures for left and right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/4p3/8/3p1p2/4P3/8/8/4K3 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 4 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validMoves.length).toEqual(2);
        expect(validMoves[0]).toEqual({
          piece: pawn,
          capturedPiece: { type: PieceType.PAWN, position: { column: 4, row: 5 }, color: Color.BLACK },
          from: { column: 5, row: 4 },
          to: { column: 4, row: 5 },
          isCheck: false,
          isEnPassant: false
        })
        expect(validMoves[1]).toEqual({
          piece: pawn,
          capturedPiece: { type: PieceType.PAWN, position: { column: 6, row: 5 }, color: Color.BLACK },
          from: { column: 5, row: 4 },
          to: { column: 6, row: 5 },
          isCheck: false,
          isEnPassant: false
        })
      });

      it('should generate black pawn captures for left and right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/4p3/3P1P2/8/8/4K3 b - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 5, row: 5 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validMoves.length).toEqual(2);
        expect(validMoves[0]).toEqual({
          piece: pawn,
          capturedPiece: { type: PieceType.PAWN, position: { column: 4, row: 4 }, color: Color.WHITE },
          from: { column: 5, row: 5 },
          to: { column: 4, row: 4 },
          isCheck: false,
          isEnPassant: false
        })
        expect(validMoves[1]).toEqual({
          piece: pawn,
          capturedPiece: { type: PieceType.PAWN, position: { column: 6, row: 4 }, color: Color.WHITE },
          from: { column: 5, row: 5 },
          to: { column: 6, row: 4 },
          isCheck: false,
          isEnPassant: false
        })
      });

      it('should generate white pawn en passant capture', () => {
        let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppp1ppp/8/3Pp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 5 }, color: Color.WHITE };
        let validMoves = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validMoves.length).toEqual(1);
        expect(validMoves[0]).toEqual({
          piece: pawn,
          capturedPiece: { type: PieceType.PAWN, position: { column: 5, row: 5 }, color: Color.BLACK },
          from: { column: 4, row: 5 },
          to: { column: 5, row: 6 },
          isCheck: false,
          isEnPassant: true
        })
      });

      it('should generate black pawn en passant capture', () => {
        let board: Board = BoardUtils.loadBoardFromFen("rnbqkbnr/ppppp1pp/8/8/4Pp2/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 6, row: 4 }, color: Color.BLACK };
        let validMoves = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validMoves.length).toEqual(1);
        expect(validMoves[0]).toEqual({
          piece: pawn,
          capturedPiece: { type: PieceType.PAWN, position: { column: 5, row: 4 }, color: Color.WHITE },
          from: { column: 6, row: 4 },
          to: { column: 5, row: 3 },
          isCheck: false,
          isEnPassant: true
        })
      });

      it('should not generate captures if pawn is pinned from right side', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/8/8/2p1p3/K2P2r1/8 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should not generate captures if pawn is pinned from left side', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/8/8/2p1p3/r2P2K1/8 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should generate limited captures if pawn is pinned diagonally from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/8/8/2p1b3/3P4/2K5 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };
        let expectedCaptures: Move[] = [
          { piece: pawn, from: { column: 4, row: 2 }, to: { column: 5, row: 3 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 5, row: 3 }, color: Color.BLACK } }
        ];

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if pawn is pinned diagonally from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/8/8/2b1p3/3P4/4K3 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };
        let expectedCaptures: Move[] = [
          { piece: pawn, from: { column: 4, row: 2 }, to: { column: 3, row: 3 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 3, row: 3 }, color: Color.BLACK } }
        ];

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should not generate captures if pawn is distantly pinned diagonally from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/b7/8/4p3/3P4/4K3 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should not generate captures if pawn is distantly pinned diagonally from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/7b/8/8/2p5/3P4/2K5 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should not generate captures if pawn is pinned diagonally from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/7b/8/8/2p5/3P4/2K5 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should not generate captures if pawn is pinned diagonally from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/8/8/2K1p3/3P4/4b3 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should not generate captures if pawn is pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/3r4/8/8/2p1p3/3P4/3K4 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });

      it('should not generate captures if pawn is pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("2k5/8/8/3K4/8/2p1p3/3P4/3r4 w - - 0 1");
        let pawn: Piece = { type: PieceType.PAWN, position: { column: 4, row: 2 }, color: Color.WHITE };

        let validCaptures = MoveGenerationUtils.getValidCaptures(board, pawn);

        expect(validCaptures).toEqual([]);
      });
    });

    describe('for queen', () => {
      it('should generate black queen captures', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/7q/8/7P/4K3 w - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 8, row: 4 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures.length).toEqual(2);
        expect(validCaptures).toContain({
          piece: queen,
          capturedPiece: { type: PieceType.PAWN, position: { column: 8, row: 2 }, color: Color.WHITE },
          from: { column: 8, row: 4 },
          to: { column: 8, row: 2 },
          isCheck: false
        })

        expect(validCaptures).toContain({
          piece: queen,
          capturedPiece: { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE },
          from: { column: 8, row: 4 },
          to: { column: 5, row: 1 },
          isCheck: false
        })
      });

      it('should generate limited captures if queen is pinned from right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3N4/N5N1/8/8/1k1q3R/8/6K1/N2N2N1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 8, row: 4 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 8, row: 4 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned from left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3N4/N5N1/8/8/1R1q3k/8/6K1/N2N2N1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 2, row: 4 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 2, row: 4 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/N2R2N1/8/8/1N1q2N1/8/6K1/N2k2N1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 7 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 4, row: 7 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/N2k2N1/8/8/1N1q2N1/8/6K1/N2R2N1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 4, row: 1 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 4, row: 1 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned diagonally from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/B2N2N1/8/7K/1N1q2N1/8/3N4/N5k1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 1, row: 7 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 1, row: 7 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned diagonally from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/3N2B1/1N6/7K/1N1q2N1/8/3N4/k5N1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 7, row: 7 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 7, row: 7 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned diagonally from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/k2N2N1/8/7K/1N1q2N1/8/1N1N4/6B1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 7, row: 1 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 7, row: 1 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if queen is pinned diagonally from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/N2N2k1/8/7K/1N1q2N1/8/3N4/BN4N1 b - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, position: { column: 4, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: queen, from: { column: 4, row: 4 }, to: { column: 1, row: 1 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 1, row: 1 }, color: Color.WHITE } }
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, queen);

        expect(validCaptures).toEqual(expectedCaptures);
      });
    });

    describe('for king', () => {
      it('should not generate king captures for protected squares', () => {
        let board: Board = BoardUtils.loadBoardFromFen("rnb1k1nr/pppppppp/8/2b5/8/8/PPPPPqPP/RNBQKBNR w KQkq - 0 1");
        let king: Piece = { type: PieceType.KING, position: { column: 5, row: 1 }, color: Color.WHITE };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, king);

        expect(validCaptures.length).toEqual(0);
      });
    });

    describe('for bishop', () => {
      it('should generate limited captures if bishop is partially pinned from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K7/8/2k5/7N/8/5b2/8/3N3B b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 6, row: 3 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);
        let expectedCaptures: Move[] = [
          { piece: bishop, from: { column: 6, row: 3 }, to: { column: 8, row: 1 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 8, row: 1 }, color: Color.WHITE } },
        ];

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if bishop is partially pinned from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("B7/5N2/8/3b4/8/5k2/N7/7K b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);
        let expectedCaptures: Move[] = [
          { piece: bishop, from: { column: 4, row: 5 }, to: { column: 1, row: 8 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 1, row: 8 }, color: Color.WHITE } },
        ];

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if bishop is partially pinned from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/N3k3/8/2b5/8/B3N2K b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 3, row: 3 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);
        let expectedCaptures: Move[] = [
          { piece: bishop, from: { column: 3, row: 3 }, to: { column: 1, row: 1 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 1, row: 1 }, color: Color.WHITE } },
        ];

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if bishop is partially pinned from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/2N3B1/8/4b3/8/2k5/7N/7K b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 5, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);
        let expectedCaptures: Move[] = [
          { piece: bishop, from: { column: 5, row: 5 }, to: { column: 7, row: 7 }, isCheck: false, capturedPiece: { type: PieceType.BISHOP, position: { column: 7, row: 7 }, color: Color.WHITE } },
        ];

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate no captures if bishop is pinned from right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/1N6/5K2/7N/8/2k2b1R/8/7N b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 6, row: 3 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if bishop is pinned from left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/5K2/N3N3/8/R1b1k3/8/4N3 b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 3, row: 3 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if bishop is pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3R4/1N3N2/8/3b2K1/8/3k4/6N1/8 b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if bishop is pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("8/8/8/1N1k2K1/8/3b4/8/1N1R1N2 b - - 0 1");
        let bishop: Piece = { type: PieceType.BISHOP, position: { column: 4, row: 3 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, bishop);

        expect(validCaptures).toEqual([]);
      });
    });

    describe('for rook', () => {
      it('should generate no captures if rook is pinned diagonally from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("1K1N4/8/5k2/8/3r3N/8/1B6/3N4 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if rook is pinned diagonally from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("1K1N4/8/1k6/8/3r3N/8/5B2/3N4 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if rook is pinned diagonally from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("1K1N4/8/5B2/8/N2r3N/8/8/k2N4 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if rook is pinned diagonally from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3N3K/8/1B6/8/N2r3N/8/8/3N2k1 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 4, row: 4 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual([]);
      });

      it('should generate limited captures if rook is partially pinned right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4N1K1/8/8/8/1k2r2R/8/8/4N3 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 5, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: rook, from: { column: 5, row: 4 }, to: { column: 8, row: 4 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 8, row: 4 }, color: Color.WHITE } },
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if rook is partially pinned left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("K3N3/8/8/8/1R2r2k/8/8/4N3 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 5, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: rook, from: { column: 5, row: 4 }, to: { column: 2, row: 4 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 2, row: 4 }, color: Color.WHITE } },
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if rook is partially pinned top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("1K6/4R3/8/8/1N2r2N/8/8/4k3 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 5, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: rook, from: { column: 5, row: 4 }, to: { column: 5, row: 7 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 5, row: 7 }, color: Color.WHITE } },
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual(expectedCaptures);
      });

      it('should generate limited captures if rook is partially pinned bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("1K6/4k3/8/8/1N2r2N/8/4R3/8 b - - 0 1");
        let rook: Piece = { type: PieceType.ROOK, position: { column: 5, row: 4 }, color: Color.BLACK };
        let expectedCaptures: Move[] = [
          { piece: rook, from: { column: 5, row: 4 }, to: { column: 5, row: 2 }, isCheck: false, capturedPiece: { type: PieceType.ROOK, position: { column: 5, row: 2 }, color: Color.WHITE } },
        ];
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, rook);

        expect(validCaptures).toEqual(expectedCaptures);
      });
    });

    describe('for knight', () => {
      it('should generate no captures if knight is pinned from top', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3R3K/2N1N3/1N3N2/3n4/1N3N2/2N1N3/8/3k4 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned from bottom', () => {
        let board: Board = BoardUtils.loadBoardFromFen("3k3K/2N1N3/1N3N2/3n4/1N3N2/2N1N3/8/3R4 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned from left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/2N1N3/1N3N2/R2n2k1/1N3N2/2N1N3/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned from right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/2N1N3/1N3N2/k2n2R1/1N3N2/2N1N3/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned diagonally from bottom right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/1kN1N3/1N3N2/3n4/1N3N2/2N1NB2/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned diagonally from bottom left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/2N1Nk2/1N3N2/3n4/1N3N2/1BN1N3/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned diagonally from top left', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/1BN1N3/1N3N2/3n4/1N3N2/2N1Nk2/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });

      it('should generate no captures if knight is pinned diagonally from top right', () => {
        let board: Board = BoardUtils.loadBoardFromFen("7K/2N1NB2/1N3N2/3n4/1N3N2/1kN1N3/8/8 b - - 0 1");
        let knight: Piece = { type: PieceType.KNIGHT, position: { column: 4, row: 5 }, color: Color.BLACK };
        let validCaptures = MoveGenerationUtils.getValidCaptures(board, knight);

        expect(validCaptures).toEqual([]);
      });
    });
  });
});
