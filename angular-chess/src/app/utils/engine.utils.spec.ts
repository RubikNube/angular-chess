import { Board, Color } from "../types/board.t";
import { Move, Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import CopyUtils from "./copy.utils";
import EngineUtils, { MoveWithScore } from "./engine.utils";
import MoveExecutionUtils from "./move-execution.utils";
import MoveUtils from "./move.utils";
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
        piece: { type: PieceType.PAWN, position: { column: 7, row: 7 }, color: Color.WHITE },
        from: { column: 7, row: 7 },
        to: { column: 7, row: 8 },
        promotedPiece: {
          color: Color.WHITE,
          position: { column: 7, row: 8 },
          type: PieceType.QUEEN
        },
        isCheck: true
      }
    );

    getEngineMove('should find black queen promotions',
      'k7/6P1/8/8/8/8/6p1/3K4 b - - 0 1',
      {
        piece: { type: PieceType.PAWN, position: { column: 7, row: 2 }, color: Color.BLACK },
        from: { column: 7, row: 2 },
        to: { column: 7, row: 1 },
        promotedPiece: {
          color: Color.BLACK,
          position: { column: 7, row: 1 },
          type: PieceType.QUEEN
        },
        isCheck: true
      }
    );
  });

  describe('getPossibleMoves', () => {
    const king: Piece = { color: Color.WHITE, type: PieceType.KING, position: { column: 4, row: 3 } };
    const pawn: Piece = { color: Color.WHITE, type: PieceType.PAWN, position: { column: 7, row: 7 } };
    const kingMoves: Move[] = [
      { piece: king, from: { column: 4, row: 3 }, to: { column: 3, row: 2 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 3, row: 3 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 3, row: 4 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 4, row: 2 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 4, row: 4 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 5, row: 2 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 5, row: 3 }, isCheck: false },
      { piece: king, from: { column: 4, row: 3 }, to: { column: 5, row: 4 }, isCheck: false }
    ];

    const blackBishop: Piece = { color: Color.BLACK, type: PieceType.BISHOP, position: { column: 6, row: 8 } };
    const blackKing: Piece = { color: Color.BLACK, type: PieceType.KING, position: { column: 1, row: 8 } };
    const blackPawn: Piece = { color: Color.BLACK, type: PieceType.PAWN, position: { column: 7, row: 2 } };

    function getPossibleMoves(description: string, fen: string, color: Color, expectedMoves: Move[]): void {
      it(description, () => {
        const board: Board = BoardUtils.loadBoardFromFen(fen);

        const actualPossibleMoves: Move[] = EngineUtils.getPossibleMoves(board, color)
          .sort(TestUtils.sortMoves);

        const expectedPossibleMoves = expectedMoves
          .sort(TestUtils.sortMoves);

        expect(actualPossibleMoves).toEqual(expectedPossibleMoves);
      });
    }

    getPossibleMoves('should return all possible moves for starting position', "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0", Color.WHITE, [
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 1, row: 2 } }, from: { column: 1, row: 2 }, to: { column: 1, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 1, row: 2 } }, from: { column: 1, row: 2 }, to: { column: 1, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 2, row: 2 } }, from: { column: 2, row: 2 }, to: { column: 2, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 2, row: 2 } }, from: { column: 2, row: 2 }, to: { column: 2, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 3, row: 2 } }, from: { column: 3, row: 2 }, to: { column: 3, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 3, row: 2 } }, from: { column: 3, row: 2 }, to: { column: 3, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 4, row: 2 } }, from: { column: 4, row: 2 }, to: { column: 4, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 4, row: 2 } }, from: { column: 4, row: 2 }, to: { column: 4, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 5, row: 2 } }, from: { column: 5, row: 2 }, to: { column: 5, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 5, row: 2 } }, from: { column: 5, row: 2 }, to: { column: 5, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 6, row: 2 } }, from: { column: 6, row: 2 }, to: { column: 6, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 6, row: 2 } }, from: { column: 6, row: 2 }, to: { column: 6, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 7, row: 2 } }, from: { column: 7, row: 2 }, to: { column: 7, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 7, row: 2 } }, from: { column: 7, row: 2 }, to: { column: 7, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 8, row: 2 } }, from: { column: 8, row: 2 }, to: { column: 8, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.PAWN, position: { column: 8, row: 2 } }, from: { column: 8, row: 2 }, to: { column: 8, row: 4 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: { column: 2, row: 1 } }, from: { column: 2, row: 1 }, to: { column: 1, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: { column: 2, row: 1 } }, from: { column: 2, row: 1 }, to: { column: 3, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: { column: 7, row: 1 } }, from: { column: 7, row: 1 }, to: { column: 6, row: 3 }, isCheck: false },
      { piece: { color: Color.WHITE, type: PieceType.KNIGHT, position: { column: 7, row: 1 } }, from: { column: 7, row: 1 }, to: { column: 8, row: 3 }, isCheck: false },
    ]);

    getPossibleMoves('should return all possible moves for white king', "8/3k4/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves);

    getPossibleMoves('should return all possible pawn promotions and add checks', "3k4/6P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should return all possible pawn promotions and add mate', "3k4/2ppp1P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should not add mate flag if the check can be blocked', "3k4/2ppb1P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat([
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
      { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
    ]));

    getPossibleMoves('should add possible captures with promotion', "3k1b2/2pp2P1/8/8/8/3K4/8/8 w - - 0 1", Color.WHITE, kingMoves.concat(
      [
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.QUEEN } },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.BISHOP } },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.KNIGHT } },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 7, row: 8 }, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 7, row: 8 }, type: PieceType.ROOK } },
      ])
      .concat([
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: true, isMate: true, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.QUEEN }, capturedPiece: blackBishop },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.BISHOP }, capturedPiece: blackBishop },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: false, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.KNIGHT }, capturedPiece: blackBishop },
        { piece: pawn, from: { column: 7, row: 7 }, to: { column: 6, row: 8 }, isEnPassant: false, isCheck: true, promotedPiece: { color: Color.WHITE, position: { column: 6, row: 8 }, type: PieceType.ROOK }, capturedPiece: blackBishop },
      ]));

    getPossibleMoves('should add possible moves for black promotion', "k7/6P1/8/8/8/8/6p1/3K4 b - - 0 1", Color.BLACK, [
      { piece: blackKing, from: { column: 1, row: 8 }, to: { column: 1, row: 7 }, isCheck: false },
      { piece: blackKing, from: { column: 1, row: 8 }, to: { column: 2, row: 7 }, isCheck: false },
      { piece: blackKing, from: { column: 1, row: 8 }, to: { column: 2, row: 8 }, isCheck: false },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: true, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.QUEEN } },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: false, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.BISHOP } },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: false, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.KNIGHT } },
      { piece: blackPawn, from: { column: 7, row: 2 }, to: { column: 7, row: 1 }, isCheck: true, promotedPiece: { color: Color.BLACK, position: { column: 7, row: 1 }, type: PieceType.ROOK } },
    ]);

    describe('getPossibleMoves performance test', () => {
      const maxTime = 2000;

      // see https://www.chessprogramming.org/Perft_Results
      function testGetPossibleMovesPerformance(startPositionFen: string, depth: number, numberOfPositions: number, maxTime: number) {
        it(`should generate ${numberOfPositions} positions for "${startPositionFen}" and ${depth} ply in maximal ${maxTime} ms`, () => {
          const board = BoardUtils.loadBoardFromFen(startPositionFen);
          const start = new Date().getTime();
          const possibleNodes = getValidMoveSequences(board, depth);
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
        const newBoard: Board = CopyUtils.deepCopyElement(board);
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

