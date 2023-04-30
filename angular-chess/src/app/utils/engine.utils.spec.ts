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

        console.log('actualPossibleMoves', actualPossibleMoves);
        console.log('expectedPossibleMoves', expectedPossibleMoves);
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
      // see https://www.chessprogramming.org/Perft_Results
      function getValidMoveSequences(board: Board, color: Color, depth: number): Move[][] {
        const possibleMoves: Move[] = EngineUtils.getPossibleMoves(board, color);
        if (depth === 1) {
          return possibleMoves.map((move: Move) => [move]);
        }
        const validMoveSequences: Move[][] = [];
        for (let move of possibleMoves) {
          const newBoard: Board | undefined = getBoardAfterMove(board, move);
          if (!newBoard) {
            continue;
          }
          const newColor: Color = color === Color.WHITE ? Color.BLACK : Color.WHITE;
          const newDepth: number = depth - 1;
          const newValidMoveSequences: Move[][] = getValidMoveSequences(newBoard, newColor, newDepth);
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

      function showMoveSequence(moveSequence: Move[]): string {
        return '[' + moveSequence.map((move: Move) => MoveUtils.moveToUci(move)).join(',') + ']';
      }

      function getPossibleTestMoves(board: Board, color: Color): TestMove[] {
        const possibleMoves: Move[] = EngineUtils.getPossibleMoves(board, color);
        return possibleMoves.map((move: Move) => {
          let testMove: TestMove = move as TestMove;
          testMove.boardBeforeMove = board;
          return testMove;
        });
      }

      it('should generate 20 positions for "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" and 1 ply', () => {
        const board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        const start = new Date().getTime();
        const possibleMoves: Move[] = EngineUtils.getPossibleMoves(board, Color.WHITE);
        const end = new Date().getTime();
        expect(possibleMoves.length).toBe(20);
        expect(end - start).toBeLessThan(100);
      });

      it('should generate 400 positions for "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" and 2 plies', () => {
        const board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        const start = new Date().getTime();
        const possibleTestMoves: TestMove[] = getPossibleTestMoves(board, Color.WHITE);
        const possibleNodes: TestMove[] = possibleTestMoves.reduce((acc: TestMove[], move: TestMove) => {
          return move && move.boardBeforeMove ? acc.concat(getPossibleTestMoves(move.boardBeforeMove, Color.BLACK)) : acc;
        }, []);
        const end = new Date().getTime();

        expect(possibleNodes.length).toBe(400);
        expect(end - start).toBeLessThan(100);
      });

      // it('should generate 8902 positions for "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" and 3 plies', () => {
      //   const board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      //   const start = new Date().getTime();
      //   const possibleNodes = getPossibleMoves(board, 3, []);
      //   const end = new Date().getTime();

      //   expect(possibleNodes.length).toBe(8902);
      //   expect(end - start).toBeLessThan(100);
      // });

      // it('should generate 197281 positions for "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" and 4 plies', () => {
      //   const board = BoardUtils.loadBoardFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      //   const start = new Date().getTime();
      //   const possibleNodes = getPossibleMoves(board, 4, []);
      //   const end = new Date().getTime();

      //   expect(possibleNodes.length).toBe(197281);
      //   expect(end - start).toBeLessThan(100);
      // });

      it('should generate 48 positions for "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -" and 1 plies', () => {
        const board = BoardUtils.loadBoardFromFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -");
        const start = new Date().getTime();
        const possibleNodes = getValidMoveSequences(board, Color.WHITE, 1);
        const end = new Date().getTime();

        expect(possibleNodes.length).toBe(48);
        expect(end - start).toBeLessThan(100);
      });

      // it('should generate 2039 positions for "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -" and 2 plies', () => {
      //   const board = BoardUtils.loadBoardFromFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -");
      //   const start = new Date().getTime();
      //   const possibleNodes = getPossibleMoves(board, 2, []);
      //   const end = new Date().getTime();

      //   expect(possibleNodes.length).toBe(2039);
      //   expect(end - start).toBeLessThan(100);
      // });+

      // it('should generate 97862 positions for "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -" and 3 plies', () => {
      //   const board = BoardUtils.loadBoardFromFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -");
      //   const start = new Date().getTime();
      //   const possibleNodes = getPossibleMoves(board, 3, []);
      //   const end = new Date().getTime();

      //   expect(possibleNodes.length).toBe(97862);
      //   expect(end - start).toBeLessThan(100);
      // });

      it('should generate 14 positions for "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - " and 1 plies', () => {
        const board = BoardUtils.loadBoardFromFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - ");
        const start = new Date().getTime();
        const possibleNodes = getValidMoveSequences(board, Color.WHITE, 1);
        const end = new Date().getTime();

        expect(possibleNodes.length).toBe(14);
        expect(end - start).toBeLessThan(100);
      });

      it('should generate 191 positions for "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - " and 2 plies', () => {
        const board = BoardUtils.loadBoardFromFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - ");
        const start = new Date().getTime();
        const moveSequences = getValidMoveSequences(board, Color.WHITE, 2);
        let fens: string[] = [];
        for (let i = 0; i < moveSequences.length; i++) {
          // console.error('### possibleNode' + i + ' ' + JSON.stringify(moveSequences[i]));
          let moveSequence: Move[] = moveSequences[i];
          let latestBoard: Board | undefined = board;
          for (let j = 0; j < moveSequence.length; j++) {
            let move = moveSequence[j];
            if (latestBoard) {
              let executedMove: Move | undefined = MoveExecutionUtils.executeMove(move, latestBoard);
              latestBoard = executedMove?.boardAfterMove;
            }
          }
          if (latestBoard) {
            fens.push(BoardUtils.getFen(latestBoard) + ' ' + showMoveSequence(moveSequence));
          }
        }

        fens.sort();

        let fenWithIndex: string = '';
        for (let i = 0; i < fens.length; i++) {
          console.error('### FEN: ' + (i + 1) + ' ' + fens[i]);
          fenWithIndex += (i + 1) + ' ' + fens[i] + '\n';
        }
        console.error('### fenWithIndex: \n' + fenWithIndex);
        // fs.writeFileSync('test-resources/validMoveSequences.txt', fenWithIndex);

        const end = new Date().getTime();

        expect(moveSequences.length).toBe(191);
        expect(end - start).toBeLessThan(100);
      });

      it('should generate 6 positions for "r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1" and 1 plies', () => {
        const board = BoardUtils.loadBoardFromFen("r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1");
        const start = new Date().getTime();
        const possibleNodes = getValidMoveSequences(board, Color.BLACK, 1);
        const end = new Date().getTime();

        expect(possibleNodes.length).toBe(6);
        expect(end - start).toBeLessThan(100);
      });

      // it('should generate 264 positions for "r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1" and 2 plies', () => {
      //   const board = BoardUtils.loadBoardFromFen("r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0 1");
      //   const start = new Date().getTime();
      //   const possibleNodes = getPossibleMoves(board, 2, []);
      //   const end = new Date().getTime();

      //   expect(possibleNodes.length).toBe(264);
      //   expect(end - start).toBeLessThan(100);
      // });
    });
  });
});