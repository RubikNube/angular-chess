import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Board, HighlightColor, Result } from '../types/board.t';
import { CastlingRights, Color, Square } from '../types/compressed.types.t';
import { Move, Piece } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import LoggingUtils, { LogLevel } from '../utils/logging.utils';
import MoveExecutionUtils from '../utils/move-execution.utils';
import PgnUtils from '../utils/pgn.utils';
import PieceUtils from '../utils/piece.utils';
import SquareUtils from '../utils/square.utils';
import { HighlightingService } from './highlighting.service';
import { MoveHistoryService } from './move-history.service';
import { PersistenceService } from './persistence.service';

/** The FEN of the normal starting position of a chess game.*/
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq";

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {
  private initialBoard: Board = {
    pieces: [],
    castlingRights: CastlingRights.ANY_CASTLING,
    playerToMove: Color.WHITE,
    result: Result.UNKNOWN,
    moveCount: 1
  };
  private board$$: BehaviorSubject<Board> = new BehaviorSubject<Board>(this.initialBoard);
  private board$: Observable<Board> = this.board$$.asObservable();

  public getPieces$: Observable<Piece[]> = this.board$$.pipe(map(board => board.pieces));
  public activePlayer$: Observable<Color> = this.board$$.pipe(map(board => board.playerToMove));

  private fen$$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private moveHistoryService: MoveHistoryService,
    private highlightingService: HighlightingService,
    protected persistenceService: PersistenceService) {
    this.moveHistoryService.boardToLoad$.subscribe(board => this.loadBoard(board));

    const moveHistory = persistenceService.load("moveHistory");
    if (!moveHistory) {
      this.importFen(STARTING_FEN);
    }
  }

  public executeMove(executableMove: Move, currentBoard: Board): void {
    const executedMove: Move | undefined = MoveExecutionUtils.executeMove(executableMove, currentBoard);
    if (executedMove && executedMove.boardAfterMove) {
      this.updateBoard(executedMove.boardAfterMove);
      this.moveHistoryService.addMoveToHistory(executedMove);
      const squareFrom = { highlight: HighlightColor.BLUE, position: executedMove.from };
      const squareTo = { highlight: HighlightColor.BLUE, position: executedMove.to };
      this.highlightingService.addSquares(squareFrom, squareTo);
    }
  }

  public updateResult(result: Result) {
    LoggingUtils.log(LogLevel.INFO, () => "updateResult: " + result)
    const currentBoard = this.board$$.getValue();
    currentBoard.result = result;

    return this.board$$.next(currentBoard);
  }

  public getResult$(): Observable<Result | undefined> {
    return this.board$.pipe(
      filter(b => !!b.result),
      map(b => b.result)
    );
  }

  public getBoard$(): Observable<Board> {
    return this.board$;
  }

  public getBoard(): Board {
    return this.board$$.getValue();
  }

  public updateBoard(board: Board): void {
    this.board$$.next(board);
  }

  public clearEnPassantSquares(): void {
    let currentBoard: Board = this.board$$.getValue();
    currentBoard.enPassantSquare = undefined;
    this.board$$.next(currentBoard);
  }

  public setEnPassantSquares(enPassantSquare: Square): void {
    let currentBoard: Board = this.board$$.getValue();
    currentBoard.enPassantSquare = enPassantSquare;
    this.board$$.next(currentBoard);
  }

  public getEnPassantSquare(): Square | undefined {
    return this.board$$.getValue().enPassantSquare;
  }

  public getEnPassantSquare$(): Observable<Square | undefined> {
    return this.board$$.pipe(map(b => {
      return b.enPassantSquare;
    }));
  }

  public getPlyCount(): number | undefined {
    return this.board$$.getValue().plyCount;
  }

  public getMoveCount(): number | undefined {
    return this.board$$.getValue().moveCount;
  }

  public setCastleRights(castleRights: CastlingRights): void {
    let currentBoard: Board = this.board$$.getValue();

    currentBoard.castlingRights = castleRights;

    this.board$$.next(currentBoard);
  }

  public getCastleRights(): CastlingRights {
    return this.board$$.getValue().castlingRights;
  }

  public getCastleRights$(player: Color): Observable<CastlingRights> {
    return this.board$.pipe(map(b => {
      return b.castlingRights;
    }));
  }

  public togglePlayerToMove(): void {
    LoggingUtils.log(LogLevel.INFO, () => "togglePlayerToMove:");
    let currentBoard: Board = this.board$$.getValue();
    let currentPlayerToMove: Color = currentBoard.playerToMove;

    currentBoard.playerToMove = currentPlayerToMove === Color.WHITE ? Color.BLACK : Color.WHITE

    this.board$$.next(currentBoard);
  }

  public getPlayerToMove$(): Observable<Color> {
    return this.board$.pipe(map(b => {
      return b.playerToMove;
    }));
  }

  public getPlayerToMove(): Color {
    return this.board$$.getValue().playerToMove;
  }

  public setFen(fen: string): void {
    this.fen$$.next(fen);
    this.moveHistoryService.resetMoveHistory();
  }

  public getPieces(): Piece[] {
    return this.board$$.getValue().pieces;
  }

  public getPiece$(columnIndex: number, rowIndex: number): Observable<Piece | undefined> {
    return this.board$$.pipe(map(board => board.pieces.find(piece => SquareUtils.fileOf(piece.position) + 1 === columnIndex && SquareUtils.rankOf(piece.position) + 1 === rowIndex)));
  }

  public importFen(newFen: string): void {
    LoggingUtils.log(LogLevel.INFO, () => "importFen: " + newFen);

    this.moveHistoryService.resetMoveHistory();
    this.updateResult(Result.UNKNOWN);

    this.importFenWithoutHistoryReset(newFen);
  }

  private importFenWithoutHistoryReset(newFen: string) {
    let board: Board = BoardUtils.loadBoardFromFen(newFen);
    this.moveHistoryService.setStartingBoard(board);

    this.loadBoard(board);
  }

  public addPiece(piece: Piece): void {
    let currentBoard = this.board$$.getValue();
    currentBoard.pieces.push(piece);
    this.board$$.next(currentBoard);
  }

  public removePiece(draggedPiece: Piece): void {
    let index = -1;
    let currentPieces = this.board$$.getValue().pieces;

    for (let i = 0; i < currentPieces.length; i++) {
      const piece = currentPieces[i];

      if (PieceUtils.pieceEquals(piece, draggedPiece)) {
        index = i;
      }
    }

    LoggingUtils.log(LogLevel.INFO, () => "removePiece " + JSON.stringify({ pieces: currentPieces, piece: draggedPiece, index: index }));

    if (index > -1) {
      currentPieces.splice(index, 1);
      let currentBoard = this.board$$.getValue();
      currentBoard.pieces = currentPieces;
      this.board$$.next(currentBoard);
    }
  }

  public importPgn(newPgn: string): void {
    const moves: Move[] = PgnUtils.extractMovesFromPgn(newPgn);

    this.moveHistoryService.resetMoveHistory();

    for (let move of moves) {
      this.moveHistoryService.addMoveToHistory(move);
    }

    let startingBoard: Board = BoardUtils.loadBoardFromFen(STARTING_FEN);
    this.moveHistoryService.setStartingBoard(startingBoard);
    const boardFromLastMove: Board | undefined = moves[moves.length - 1].boardAfterMove;
    this.loadBoard(boardFromLastMove);
  }

  public loadBoard(boardFromLastMove: Board | undefined) {
    if (boardFromLastMove) {
      this.highlightingService.clearNotListedColoredSquares();
      this.board$$.next(boardFromLastMove);
      const fenFromLastMove: string = BoardUtils.getFen(boardFromLastMove);
      this.fen$$.next(fenFromLastMove);
    }
  }
}
