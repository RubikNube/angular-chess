import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Board, CastleRights, Color, Position, Result } from '../types/board.t';
import { Move, Piece } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import PgnUtils from '../utils/pgn.utils';
import PieceUtils from '../utils/piece.utils';
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
    whiteCastleRights: { player: Color.WHITE, canLongCastle: true, canShortCastle: true },
    blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
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

  public updateResult(result: Result) {
    console.log("updateResult: " + result)
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

  public setEnPassantSquares(enPassantSquare: Position): void {
    let currentBoard: Board = this.board$$.getValue();
    currentBoard.enPassantSquare = enPassantSquare;
    this.board$$.next(currentBoard);
  }

  public getEnPassantSquare(): Position | undefined {
    return this.board$$.getValue().enPassantSquare;
  }

  public getEnPassantSquare$(): Observable<Position | undefined> {
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

  public setCastleRights(castleRights: CastleRights): void {
    let currentBoard: Board = this.board$$.getValue();

    if (castleRights.player === Color.WHITE) {
      currentBoard.whiteCastleRights = castleRights;
    }
    else {
      currentBoard.blackCastleRights = castleRights;
    }

    this.board$$.next(currentBoard);
  }

  public getCastleRights(player: Color): CastleRights {
    if (player === Color.WHITE) {
      return this.board$$.getValue().whiteCastleRights;
    }
    else {
      return this.board$$.getValue().blackCastleRights;
    }
  }

  public getCastleRights$(player: Color): Observable<CastleRights> {
    if (player === Color.WHITE) {
      return this.board$.pipe(map(b => {
        return b.whiteCastleRights;
      }));
    }
    else {
      return this.board$.pipe(map(b => {
        return b.blackCastleRights;
      }));
    }
  }

  public togglePlayerToMove(): void {
    console.log("togglePlayerToMove:");
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
    return this.board$$.pipe(map(board => board.pieces.find(piece => piece.position.column === columnIndex && piece.position.row === rowIndex)));
  }

  public importFen(newFen: string): void {
    console.log("importFen: " + newFen);

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

    console.log("removePiece " + JSON.stringify({ pieces: currentPieces, piece: draggedPiece, index: index }));

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
