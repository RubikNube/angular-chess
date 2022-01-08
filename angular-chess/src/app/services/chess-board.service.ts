import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Board, CastleRights, Color, Position, Result } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import BoardUtils from '../utils/board.utils';
import PieceUtils from '../utils/piece.utils';
import PositionUtils from '../utils/position.utils';
import { HighlightingService } from './highlighting.service';
import { MoveHistoryService } from './move-history.service';

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {
  initialBoard: Board = {
    pieces: [],
    whiteCastleRights: { player: Color.WHITE, canLongCastle: true, canShortCastle: true },
    blackCastleRights: { player: Color.BLACK, canShortCastle: true, canLongCastle: true },
    playerToMove: Color.WHITE,
    result: Result.UNKNOWN,
  };
  boardSource: BehaviorSubject<Board> = new BehaviorSubject<Board>(this.initialBoard);
  board$: Observable<Board> = this.boardSource.asObservable();

  attackedSquaresFromBlackSource: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  attackedSquaresFromBlack$: Observable<Position[]> = this.attackedSquaresFromBlackSource.asObservable();
  attackedSquaresFromWhiteSource: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  attackedSquaresFromWhite$: Observable<Position[]> = this.attackedSquaresFromWhiteSource.asObservable();

  private fenSource: BehaviorSubject<string> = new BehaviorSubject("");
  fen$ = this.fenSource.asObservable();

  constructor(public highlightingService: HighlightingService,
    public moveHistoryService: MoveHistoryService) {
  }

  public getBoard$(): Observable<Board> {
    return this.board$;
  }

  public getBoard(): Board {
    return this.boardSource.getValue();
  }

  public getKing(color: Color): Piece {
    let king = this.boardSource.getValue().pieces.find(p => p.color === color && p.type === PieceType.KING);

    if (king !== undefined) {
      return king;
    }
    else {
      throw Error("No king existing with color " + color);
    }
  }

  public clearEnPassantSquares(): void {
    let currentBoard: Board = this.boardSource.getValue();
    currentBoard.enPassantSquare = undefined;
    this.boardSource.next(currentBoard);
  }

  public setEnPassantSquares(enPassantSquare: Position) {
    let currentBoard: Board = this.boardSource.getValue();
    currentBoard.enPassantSquare = enPassantSquare;
    this.boardSource.next(currentBoard);
  }

  public getEnPassantSquare(): Position | undefined {
    return this.boardSource.getValue().enPassantSquare;
  }

  public getEnPassantSquare$(): Observable<Position | undefined> {
    return this.boardSource.pipe(map(b => {
      return b.enPassantSquare;
    }));
  }

  public setCastleRights(castleRights: CastleRights) {
    let currentBoard: Board = this.boardSource.getValue();

    if (castleRights.player === Color.WHITE) {
      currentBoard.whiteCastleRights = castleRights;
    }
    else {
      currentBoard.blackCastleRights = castleRights;
    }

    this.boardSource.next(currentBoard);
  }

  public getCastleRights(player: Color) {
    if (player === Color.WHITE) {
      return this.boardSource.getValue().whiteCastleRights;
    }
    else {
      return this.boardSource.getValue().blackCastleRights;
    }
  }

  public getCastleRights$(player: Color) {
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
    let currentBoard: Board = this.boardSource.getValue();
    let currentPlayerToMove: Color = currentBoard.playerToMove;

    currentBoard.playerToMove = currentPlayerToMove === Color.WHITE ? Color.BLACK : Color.WHITE

    this.boardSource.next(currentBoard);
  }

  public getPlayerToMove$() {
    return this.board$.pipe(map(b => {
      return b.playerToMove;
    }));
  }

  public getPlayerToMove() {
    return this.boardSource.getValue().playerToMove;
  }

  public setAttackedSquaresFromBlack(squares: Position[]) {
    this.attackedSquaresFromBlackSource.next(squares);
  }

  public getAttackedSquaresFromBlack$(): Observable<Position[]> {
    return this.attackedSquaresFromBlack$;
  }

  public getAttackedSquares(color: Color): Position[] {
    if (color === Color.WHITE) {
      return this.attackedSquaresFromWhiteSource.getValue();
    }
    else {
      return this.attackedSquaresFromBlackSource.getValue();
    }
  }

  public getAttackedSquaresFromBlack(): Position[] {
    return this.attackedSquaresFromBlackSource.getValue();
  }

  public setAttackedSquaresFromWhite(squares: Position[]) {
    this.attackedSquaresFromWhiteSource.next(squares);
  }

  public getAttackedSquaresFromWhite$(): Observable<Position[]> {
    return this.attackedSquaresFromWhite$;
  }

  public getAttackedSquaresFromWhite(): Position[] {
    return this.attackedSquaresFromWhiteSource.getValue();
  }

  public setFen(fen: string) {
    this.fenSource.next(fen);
    this.moveHistoryService.resetMoveHistory();
  }

  public getPieces(): Piece[] {
    return this.boardSource.getValue().pieces;
  }

  public importFen(newFen: string): void {
    console.log("importFen: " + newFen);

    this.moveHistoryService.resetMoveHistory();

    let board: Board = BoardUtils.loadBoardFromFen(newFen);

    this.boardSource.next(board);
    this.fenSource.next(newFen);
  }

  addPiece(piece: Piece) {
    let currentBoard = this.boardSource.getValue();
    currentBoard.pieces.push(piece);
    this.boardSource.next(currentBoard);
  }

  removePiece(draggedPiece: Piece) {
    let index = -1;
    let currentPieces = this.boardSource.getValue().pieces;

    for (let i = 0; i < currentPieces.length; i++) {
      const piece = currentPieces[i];

      if (PieceUtils.pieceEquals(piece, draggedPiece)) {
        index = i;
      }
    }

    console.log("removePiece " + JSON.stringify({ pieces: currentPieces, piece: draggedPiece, index: index }));

    if (index > -1) {
      currentPieces.splice(index, 1);
      let currentBoard = this.boardSource.getValue();
      currentBoard.pieces = currentPieces;
      this.boardSource.next(currentBoard);
    }
  }
}
