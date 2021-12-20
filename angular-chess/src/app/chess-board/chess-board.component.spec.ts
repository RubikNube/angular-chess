import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessBoardComponent } from './chess-board.component';
import { Color, PieceType } from './pieces.t';

describe('ChessBoardComponent', () => {
  let component: ChessBoardComponent;
  let fixture: ComponentFixture<ChessBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChessBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should setup the initial position', () => {
    expect(component.pieces).toEqual([
        { color: Color.WHITE, type: PieceType.ROOK, position: { row: 1, column: 1 } },
        { color: Color.WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 2 } },
        { color: Color.WHITE, type: PieceType.BISHOP, position: { row: 1, column: 3 } },
        { color: Color.WHITE, type: PieceType.QUEEN, position: { row: 1, column: 4 } },
        { color: Color.WHITE, type: PieceType.KING, position: { row: 1, column: 5 } },
        { color: Color.WHITE, type: PieceType.BISHOP, position: { row: 1, column: 6 } },
        { color: Color.WHITE, type: PieceType.KNIGHT, position: { row: 1, column: 7 } },
        { color: Color.WHITE, type: PieceType.ROOK, position: { row: 1, column: 8 } },
    
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 1 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 2 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 3 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 4 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 5 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 6 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 7 } },
        { color: Color.WHITE, type: PieceType.PAWN, position: { row: 2, column: 8 } },
    
        { color: Color.BLACK, type: PieceType.ROOK, position: { row: 8, column: 1 } },
        { color: Color.BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 2 } },
        { color: Color.BLACK, type: PieceType.BISHOP, position: { row: 8, column: 3 } },
        { color: Color.BLACK, type: PieceType.QUEEN, position: { row: 8, column: 4 } },
        { color: Color.BLACK, type: PieceType.KING, position: { row: 8, column: 5 } },
        { color: Color.BLACK, type: PieceType.BISHOP, position: { row: 8, column: 6 } },
        { color: Color.BLACK, type: PieceType.KNIGHT, position: { row: 8, column: 7 } },
        { color: Color.BLACK, type: PieceType.ROOK, position: { row: 8, column: 8 } },
    
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 1 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 2 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 3 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 4 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 5 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 6 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 7 } },
        { color: Color.BLACK, type: PieceType.PAWN, position: { row: 7, column: 8 } },
    ])
  });
});
