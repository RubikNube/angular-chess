import { Board } from "../types/board.t";
import { Color, PieceType, Square } from "../types/compressed.types.t";
import { Move, Piece } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import CopyUtils from "./copy.utils";
import EngineUtils, { MoveWithScore } from "./engine.utils";
import MoveExecutionUtils from "./move-execution.utils";
import TestUtils from "./test.utils";

type TestMove = Move & { boardBeforeMove: Board | undefined };

describe('EngineUtils', () => {

  describe('getEngineMove', () => {
    function getEngineMove(description: string, fen: string, expectedMove: MoveWithScore) {
      it(description, async () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);

        let actualMove: MoveWithScore | undefined = await EngineUtils.getEngineMove(board);
        // remove score from actual move
        if (actualMove) {
          delete actualMove.score;
        }
        expect(actualMove).toEqual(expectedMove);
      });
    }
    getEngineMove('should find white queen promotions',
      'k7/6P1/8/8/8/8/8/3K4 w - - 0 1',
      {
        piece: { type: PieceType.PAWN, position: Square.SQ_G7, color: Color.WHITE },
        from: Square.SQ_G7,
        to: Square.SQ_G8,
        promotedPiece: {
          color: Color.WHITE,
          position: Square.SQ_G8,
          type: PieceType.QUEEN
        },
        isCheck: true
      }
    );

    getEngineMove('should find black queen promotions',
      'k7/6P1/8/8/8/8/6p1/3K4 b - - 0 1',
      {
        piece: { type: PieceType.PAWN, position: Square.SQ_G2, color: Color.BLACK },
        from: Square.SQ_G2,
        to: Square.SQ_G1,
        promotedPiece: {
          color: Color.BLACK,
          position: Square.SQ_G1,
          type: PieceType.QUEEN
        },
        isCheck: true
      }
    );
  });

  describe('getPossibleMoves', () => {
    const king: Piece = { color: Color.WHITE, type: PieceType.KING, position: Square.SQ_D3 };
    const pawn: Piece = { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_G7 };
    const kingMoves: Move[] = [
      { piece: king, from: Square.SQ_D3, to: Square.SQ_C2, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_C3, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_C4, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_D2, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_D4, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_E2, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_E3, isCheck: false },
      { piece: king, from: Square.SQ_D3, to: Square.SQ_E4, isCheck: false }
    ];

    const blackBishop: Piece = { color: Color.BLACK, type: PieceType.BISHOP, position: Square.SQ_F8 };
    const blackKing: Piece = { color: Color.BLACK, type: PieceType.KING, position: Square.SQ_A8 };
    const blackPawn: Piece = { color: Color.BLACK, type: PieceType.PAWN, position: Square.SQ_G2 };

    function getPossibleMoves(description: string, fen: string, color: Color, expectedMoves: Move[]): void {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);

        const actualPossibleMoves: Move[] = EngineUtils.getPossibleMoves(board, color)
          .sort(TestUtils.compareMoves);

        const expectedPossibleMoves = expectedMoves
          .sort(TestUtils.compareMoves);

        TestUtils.checkMoves(expectedPossibleMoves, actualPossibleMoves);
      });
    }

    getPossibleMoves('should return all possible moves for starting position', "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0", Color.WHITE, [
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_A2 }, from: Square.SQ_A2, to: Square.SQ_A3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_A2 }, from: Square.SQ_A2, to: Square.SQ_A4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_B2 }, from: Square.SQ_B2, to: Square.SQ_B3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_B2 }, from: Square.SQ_B2, to: Square.SQ_B4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_C2 }, from: Square.SQ_C2, to: Square.SQ_C3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_C2 }, from: Square.SQ_C2, to: Square.SQ_C4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_D2 }, from: Square.SQ_D2, to: Square.SQ_D3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_D2 }, from: Square.SQ_D2, to: Square.SQ_D4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_E2 }, from: Square.SQ_E2, to: Square.SQ_E3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_E2 }, from: Square.SQ_E2, to: Square.SQ_E4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_F2 }, from: Square.SQ_F2, to: Square.SQ_F3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_F2 }, from: Square.SQ_F2, to: Square.SQ_F4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_G2 }, from: Square.SQ_G2, to: Square.SQ_G3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_G2 }, from: Square.SQ_G2, to: Square.SQ_G4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_H2 }, from: Square.SQ_H2, to: Square.SQ_H3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: Square.SQ_H2 }, from: Square.SQ_H2, to: Square.SQ_H4, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: Square.SQ_B1 }, from: Square.SQ_B1, to: Square.SQ_A3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: Square.SQ_B1 }, from: Square.SQ_B1, to: Square.SQ_C3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: Square.SQ_G1 }, from: Square.SQ_G1, to: Square.SQ_F3, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: Square.SQ_G1 }, from: Square.SQ_G1, to: Square.SQ_H3, isCheck: false },
    ]);

    getPossibleMoves('should return all possible moves for white king', "8/3k4/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves);

    getPossibleMoves('should return all possible pawn promotions and add checks', "3k4/6P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.QUEEN } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.BISHOP } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.KNIGHT } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should return all possible pawn promotions and add mate', "3k4/2ppp1P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.QUEEN } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.BISHOP } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.KNIGHT } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should not add mate flag if the check can be blocked', "3k4/2ppb1P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.QUEEN } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.BISHOP } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.KNIGHT } },
      { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should add possible captures with promotion', "3k1b2/2pp2P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat(
      [
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.QUEEN } },
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.BISHOP } },
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.KNIGHT } },
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_G8, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_G8, type: PieceType.ROOK } },
      ])
      .concat([
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_F8, isEnPassant: false, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_F8, type: PieceType.QUEEN }, capturedPiece: blackBishop },
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_F8, isEnPassant: false, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_F8, type: PieceType.BISHOP }, capturedPiece: blackBishop },
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_F8, isEnPassant: false, isCheck: false, promotedPiece: { color: Color.WHITE, position: Square.SQ_F8, type: PieceType.KNIGHT }, capturedPiece: blackBishop },
        { piece: pawn, from: Square.SQ_G7, to: Square.SQ_F8, isEnPassant: false, isCheck: true, promotedPiece: { color: Color.WHITE, position: Square.SQ_F8, type: PieceType.ROOK }, capturedPiece: blackBishop },
      ]));

    getPossibleMoves('should add possible moves for black promotion', "k7/6P1/8/8/8/8/6p1/3K4 b - - 0 1", Color.BLACK, [
      { piece: blackKing, from: Square.SQ_A8, to: Square.SQ_A7, isCheck: false },
      { piece: blackKing, from: Square.SQ_A8, to: Square.SQ_B7, isCheck: false },
      { piece: blackKing, from: Square.SQ_A8, to: Square.SQ_B8, isCheck: false },
      { piece: blackPawn, from: Square.SQ_G2, to: Square.SQ_G1, isCheck: true, promotedPiece: { color: Color.BLACK, position: Square.SQ_G1, type: PieceType.QUEEN } },
      { piece: blackPawn, from: Square.SQ_G2, to: Square.SQ_G1, isCheck: false, promotedPiece: { color: Color.BLACK, position: Square.SQ_G1, type: PieceType.BISHOP } },
      { piece: blackPawn, from: Square.SQ_G2, to: Square.SQ_G1, isCheck: false, promotedPiece: { color: Color.BLACK, position: Square.SQ_G1, type: PieceType.KNIGHT } },
      { piece: blackPawn, from: Square.SQ_G2, to: Square.SQ_G1, isCheck: true, promotedPiece: { color: Color.BLACK, position: Square.SQ_G1, type: PieceType.ROOK } },
    ]);

    getPossibleMoves('should calculated all possible moves for black in "r1bqk2r/p1p3pp/2P5/4Qp2/2p5/5N2/PPP2PPP/RNB3K1 b kq - 0 0"', 'r1bqk2r/p1p3pp/2P5/4Qp2/2p5/5N2/PPP2PPP/RNB3K1 b kq - 0 0', Color.BLACK, [
      // bishop move from c8 to e6
      { piece: { color: Color.BLACK, type: PieceType.BISHOP, position: Square.SQ_C8 }, from: Square.SQ_C8, to: Square.SQ_E6, isCheck: false },
      // queen move from d8 to e7
      { piece: { color: Color.BLACK, type: PieceType.QUEEN, position: Square.SQ_D8 }, from: Square.SQ_D8, to: Square.SQ_E7, isCheck: false },
      // king moves from e8 to f8 and f7
      { piece: { color: Color.BLACK, type: PieceType.KING, position: Square.SQ_E8 }, from: Square.SQ_E8, to: Square.SQ_F8, isCheck: false },
      { piece: { color: Color.BLACK, type: PieceType.KING, position: Square.SQ_E8 }, from: Square.SQ_E8, to: Square.SQ_F7, isCheck: false },
    ]);

    describe('getPossibleMoves performance test', () => {
      const maxTime = 2000;

      // see https://www.chessprogramming.org/Perft_Results
      function testGetPossibleMovesPerformance(startPositionFen: string, depth: number, numberOfPositions: number, maxTime: number) {
        it(`should generate ${numberOfPositions} positions for "${startPositionFen}" and ${depth} ply in maximal ${maxTime} ms`, () => {
          const board = BoardUtils.loadBoardFromFen(startPositionFen);
          const start = new Date().getTime();
          const possibleNodes = getValidMoveSequences(board, depth);
          const ACTIVATE_MOVE_SEQUENCES = false; // set to true to print move sequences
          if (ACTIVATE_MOVE_SEQUENCES) {
            const moveSequences = TestUtils.printMoveSequences(possibleNodes, board);
            console.error(moveSequences)
          }
          const end = new Date().getTime();

          expect(possibleNodes.length).toBe(numberOfPositions);
          expect(end - start).toBeLessThan(maxTime);
        });
      }

      function getValidMoveSequences(board: Board, depth: number): Move[][] {
        const possibleMoves: Move[] = EngineUtils.getPossibleMoves(board, board.playerToMove);
        if (depth === 1) {
          return possibleMoves.map((move: Move) => [move]);
        }
        const validMoveSequences: Move[][] = [];
        for (let move of possibleMoves) {
          const newBoard: Board | undefined = getBoardAfterMove(board, move);
          if (!newBoard) {
            continue;
          }
          const newDepth: number = depth - 1;
          const newValidMoveSequences: Move[][] = getValidMoveSequences(newBoard, newDepth);
          for (let newValidMoveSequence of newValidMoveSequences) {
            validMoveSequences.push([move].concat(newValidMoveSequence));
          }
        }
        return validMoveSequences;
      }

      function getBoardAfterMove(board: Board, move: Move): Board | undefined {
        const newBoard: Board = CopyUtils.copyBoard(board);
        let executedMove: Move | undefined = MoveExecutionUtils.executeMove(move, newBoard);
        return executedMove?.boardAfterMove;
      }


      testGetPossibleMovesPerformance(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        1,
        20,
        maxTime);

      testGetPossibleMovesPerformance(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        2,
        400,
        maxTime);

      testGetPossibleMovesPerformance(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        3,
        8902,
        maxTime);

      testGetPossibleMovesPerformance(
        'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -',
        1,
        48,
        maxTime);

      testGetPossibleMovesPerformance(
        'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -',
        2,
        2039,
        maxTime);

      testGetPossibleMovesPerformance(
        '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - ',
        1,
        14,
        maxTime);

      testGetPossibleMovesPerformance(
        '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - ',
        2,
        191,
        maxTime);

      testGetPossibleMovesPerformance(
        'r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1',
        1,
        6,
        maxTime);

      testGetPossibleMovesPerformance(
        'r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1',
        2,
        264,
        maxTime);
    });
  });
});

