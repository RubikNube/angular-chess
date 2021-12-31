import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CastleRights, Color, Position, Result } from '../types/board.t';
import { Move, Piece, PieceType } from '../types/pieces.t';
import PieceUtils from '../utils/piece.utils';
import PositionUtils from '../utils/position.utils';
import { HighlightingService } from './highlighting.service';
import { MoveHistoryService } from './move-history.service';

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {
  pieces: Piece[] = [];
  attackedSquaresFromBlackSource: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  attackedSquaresFromBlack$: Observable<Position[]> = this.attackedSquaresFromBlackSource.asObservable();
  attackedSquaresFromWhiteSource: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  attackedSquaresFromWhite$: Observable<Position[]> = this.attackedSquaresFromWhiteSource.asObservable();

  playerToMoveSource: BehaviorSubject<Color> = new BehaviorSubject<Color>(Color.WHITE);
  playerToMove$: Observable<Color> = this.playerToMoveSource.asObservable();

  whiteCastleRightsSource: BehaviorSubject<CastleRights> = new BehaviorSubject<CastleRights>({ player: Color.WHITE, canLongCastle: true, canShortCastle: true });
  whiteCastleRights$: Observable<CastleRights> = this.whiteCastleRightsSource.asObservable();

  blackCastleRightsSource: BehaviorSubject<CastleRights> = new BehaviorSubject<CastleRights>({ player: Color.BLACK, canLongCastle: true, canShortCastle: true });
  blackCastleRights$: Observable<CastleRights> = this.blackCastleRightsSource.asObservable();

  enPassantSquaresSource: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  enPassantSquares$: Observable<Position[]> = this.enPassantSquaresSource.asObservable();

  result: Result = Result.UNKNOWN;

  private fenSource: BehaviorSubject<string> = new BehaviorSubject("");
  fen$ = this.fenSource.asObservable();


  constructor(public highlightingService: HighlightingService,
    public moveHistoryService: MoveHistoryService) {
  }

  public getKing(color: Color): Piece {
    let king = this.pieces.find(p => p.color === color && p.type === PieceType.KING);

    if (king !== undefined) {
      return king;
    }
    else {
      throw Error("No king existing with color " + color);
    }
  }

  public clearEnPassantSquares(): void {
    this.enPassantSquaresSource.next([]);
  }

  public setEnPassantSquares(...enPassantSquares: Position[]) {
    this.enPassantSquaresSource.next(enPassantSquares);
  }

  public isEnPassantSquare(position: Position): boolean {
    return PositionUtils.includes(this.enPassantSquaresSource.getValue(), position);
  }

  public getEnPassantSquares(): Position[] {
    return this.enPassantSquaresSource.getValue();
  }

  public getEnPassantSquares$(): Observable<Position[]> {
    return this.enPassantSquares$;
  }

  public setCastleRights(castleRights: CastleRights) {
    if (castleRights.player === Color.WHITE) {
      return this.whiteCastleRightsSource.next(castleRights);
    }
    else {
      return this.blackCastleRightsSource.next(castleRights);
    }
  }

  public getCastleRights(player: Color) {
    if (player === Color.WHITE) {
      return this.whiteCastleRightsSource.getValue();
    }
    else {
      return this.blackCastleRightsSource.getValue();
    }
  }

  public getCastleRights$(player: Color) {
    if (player === Color.WHITE) {
      return this.whiteCastleRights$;
    }
    else {
      return this.blackCastleRights$;
    }
  }

  public togglePlayerToMove(): void {
    this.playerToMoveSource.next(this.playerToMoveSource.getValue() === Color.WHITE ? Color.BLACK : Color.WHITE);
  }

  public getPlayerToMove$() {
    return this.playerToMove$;
  }

  public getPlayerToMove() {
    return this.playerToMoveSource.getValue();
  }

  public setAttackedSquaresFromBlack(squares: Position[]) {
    this.attackedSquaresFromBlackSource.next(squares);
  }

  public getAttackedSquaresFromBlack$(): Observable<Position[]> {
    return this.attackedSquaresFromBlack$;
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
    return this.pieces;
  }

  public importFen(newFen: string): void {
    console.log("importFen: " + newFen);

    this.moveHistoryService.resetMoveHistory();
    this.pieces = [];

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

          this.pieces.push(newPiece);
          currentPos++;
        } else {
          console.error("Not a number or a piece char: " + currentChar);
        }
      }
    };

    if (fenSections.length > 1) {
      let playerChar = fenSections[1];

      if (playerChar === 'w') {
        this.playerToMoveSource.next(Color.WHITE);
      }
      else {
        this.playerToMoveSource.next(Color.BLACK);
      }
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

      this.whiteCastleRightsSource.next(whiteCastleRights);
      this.blackCastleRightsSource.next(blackCastleRights);
    }
    else {

      let whiteCastleRights: CastleRights = { player: Color.WHITE, canShortCastle: false, canLongCastle: false };
      let blackCastleRights: CastleRights = { player: Color.BLACK, canShortCastle: false, canLongCastle: false };
      this.whiteCastleRightsSource.next(whiteCastleRights);
      this.blackCastleRightsSource.next(blackCastleRights);
    }

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
    return this.pieces.find(p => {
      return p.position.row === pos.row
        && p.position.column === pos.column;
    });
  }

  addPiece(piece: Piece) {
    this.pieces.push(piece);
  }

  removePiece(draggedPiece: Piece) {
    let index = -1;

    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];

      if (PieceUtils.pieceEquals(piece, draggedPiece)) {
        index = i;
      }
    }

    console.log("removePiece " + JSON.stringify({ pieces: this.pieces, piece: draggedPiece, index: index }));

    if (index > -1) {
      this.pieces.splice(index, 1);
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
