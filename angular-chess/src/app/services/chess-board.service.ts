import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Board, CastleRights, Color, Position, Result } from '../types/board.t';
import { Piece } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import PieceUtils from '../utils/piece.utils';
import { MoveHistoryService } from './move-history.service';

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
  };
  private board$$: BehaviorSubject<Board> = new BehaviorSubject<Board>(this.initialBoard);
  private board$: Observable<Board> = this.board$$.asObservable();

  private attackedSquaresFromBlack$$: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  private attackedSquaresFromBlack$: Observable<Position[]> = this.attackedSquaresFromBlack$$.asObservable();
  private attackedSquaresFromWhite$$: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  private attackedSquaresFromWhite$: Observable<Position[]> = this.attackedSquaresFromWhite$$.asObservable();

  private fen$$: BehaviorSubject<string> = new BehaviorSubject("");
  private fen$ = this.fen$$.asObservable();

  constructor(private moveHistoryService: MoveHistoryService) {
  }

  public getBoard$(): Observable<Board> {
    return this.board$;
  }

  public getBoard(): Board {
    return this.board$$.getValue();
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

  public setAttackedSquaresFromBlack(squares: Position[]): void {
    this.attackedSquaresFromBlack$$.next(squares);
  }

  public getAttackedSquaresFromBlack$(): Observable<Position[]> {
    return this.attackedSquaresFromBlack$;
  }

  public getAttackedSquares(color: Color): Position[] {
    if (color === Color.WHITE) {
      return this.attackedSquaresFromWhite$$.getValue();
    }
    else {
      return this.attackedSquaresFromBlack$$.getValue();
    }
  }

  public getAttackedSquaresFromBlack(): Position[] {
    return this.attackedSquaresFromBlack$$.getValue();
  }

  public setAttackedSquaresFromWhite(squares: Position[]) {
    this.attackedSquaresFromWhite$$.next(squares);
  }

  public getAttackedSquaresFromWhite$(): Observable<Position[]> {
    return this.attackedSquaresFromWhite$;
  }

  public getAttackedSquaresFromWhite(): Position[] {
    return this.attackedSquaresFromWhite$$.getValue();
  }

  public setFen(fen: string): void {
    this.fen$$.next(fen);
    this.moveHistoryService.resetMoveHistory();
  }

  public getPieces(): Piece[] {
    return this.board$$.getValue().pieces;
  }

  public importFen(newFen: string): void {
    console.log("importFen: " + newFen);

    this.moveHistoryService.resetMoveHistory();

    let board: Board = BoardUtils.loadBoardFromFen(newFen);

    this.board$$.next(board);
    this.fen$$.next(newFen);
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
}
