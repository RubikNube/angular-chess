import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ChessBoardComponent } from './chess-board.component';
import { Color, PieceType } from './pieces.t';

describe('ChessBoardComponent', () => {
  let component: ChessBoardComponent;
  let fixture: ComponentFixture<ChessBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChessBoardComponent]
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
    expect(component.pieces.sort(comparePositions())).toEqual([
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
    ].sort(comparePositions()))
  });
});

describe('importFen', () => {
  let component: ChessBoardComponent;
  let fixture: ComponentFixture<ChessBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChessBoardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should empty the board for empty fen', () => {
    component.importFen("8/8/8//8/8/8/8/8");
    expect(component.pieces).toEqual([]);
  });

  it('should load start FEN', () => {
    component.importFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    expect(component.pieces.sort(comparePositions())).toEqual([
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

    ]
      .sort(comparePositions()));
  });
});

function comparePositions(): ((a: { color: Color; type: PieceType; position: { row: number; column: number; }; }, b: { color: Color; type: PieceType; position: { row: number; column: number; }; }) => number) | undefined {
  return (a, b) => {
    let rowA = a.position.row;
    let columnA = a.position.column;

    let rowB = b.position.row;
    let columnB = b.position.column;

    if (rowA < rowB) {
      return -1;
    } else if (rowA > rowB) {
      return 1;
    } else {
      if (columnA < columnB) {
        return -1;
      } else if (columnA > columnB) {
        return 1;
      } else {
        return 0;
      };
    }
  };
}

