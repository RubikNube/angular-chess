import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Board, CastleRights, Color, Position, Result } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
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

  public isEnPassantSquare(position: Position): boolean {
    let enPassantSquare = this.boardSource.getValue().enPassantSquare;

    return enPassantSquare !== undefined && PositionUtils.positionEquals(enPassantSquare, position);
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
    let pieces: Piece[] = [];

    let fenSections = newFen.split(' ');

    let fenRows: string[] = fenSections[0].split("/");
    for (let j = 0; j < fenRows.length; j++) {
      let fenRow: string = fenRows[j];
      let currentPos: number = 0;
      for (let i = 0; i < fenRow.length; i++) {
        const currentChar = fenRow[i];
        console.log("currentChar " + currentChar);

        if (currentChar.match("\\d")) {
          let columnsToAdd = parseInt(currentChar);
          console.log("columnsToAdd " + columnsToAdd);
          currentPos += columnsToAdd;
        }
        else if (currentChar.toUpperCase().match("[R|B|Q|K|N|P]")) {
          let newPiece: Piece = {
            color: currentChar.match("[A-Z]") ? Color.WHITE : Color.BLACK,
            type: this.getPiece(currentChar),
            position: { row: 8 - j, column: currentPos + 1 }
          };

          console.log("add piece " + JSON.stringify(newPiece))

          pieces.push(newPiece);
          currentPos++;
        } else {
          console.error("Not a number or a piece char: " + currentChar);
        }
      }
    };

    let currentBoard: Board = this.initialBoard;
    currentBoard.pieces = pieces;

    if (fenSections.length > 1) {
      let playerChar = fenSections[1];

      currentBoard.playerToMove = playerChar === 'w' ? Color.WHITE : Color.BLACK;
    }


    if (fenSections.length > 2) {
      let castleFen = fenSections[2];

      let whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
      let blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

      for (let index = 0; index < castleFen.length; index++) {
        const castleChar = castleFen[index];


        switch (castleChar) {
          case 'K':
            whiteCastleRights.canShortCastle = true;
            break;
          case 'Q':
            whiteCastleRights.canLongCastle = true;
            break;
          case 'k':
            blackCastleRights.canShortCastle = true;
            break;
          case 'q':
            blackCastleRights.canLongCastle = true;
            break;

          default:
            break;
        }
      }

      currentBoard.whiteCastleRights = whiteCastleRights;
      currentBoard.blackCastleRights = blackCastleRights;
    }
    else {
      let whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
      let blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };

      currentBoard.whiteCastleRights = whiteCastleRights;
      currentBoard.blackCastleRights = blackCastleRights;
    }

    this.boardSource.next(currentBoard);
    this.fenSource.next(newFen);
  }

  getPiece(pieceChar: string): PieceType {
    switch (pieceChar.toUpperCase()) {
      case 'K':
        return PieceType.KING;
      case 'Q':
        return PieceType.QUEEN;
      case 'R':
        return PieceType.ROOK;
      case 'B':
        return PieceType.BISHOP;
      case 'N':
        return PieceType.KNIGHT;
      case 'P':
        return PieceType.PAWN;
      default:
        throw Error("Unknown piece: " + pieceChar);
    }
  }


  getPieceOnPos(pos: Position): Piece | undefined {
    return this.boardSource.getValue().pieces.find(p => {
      return p.position.row === pos.row
        && p.position.column === pos.column;
    });
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

  public isFree(position: Position, color: Color): boolean {
    let absPos = PositionUtils.getAbsolutePosition(position, color);
    let result = this.getPieceOnPos(absPos) === undefined;
    console.log("isFree position:" + JSON.stringify(absPos) + ", result: " + result);
    return result;
  }

  public isAbsFree(position: Position): boolean {
    let result = this.getPieceOnPos(position) === undefined;
    console.log("isFree position:" + JSON.stringify(position) + ", result: " + result);
    return result;
  }

}
