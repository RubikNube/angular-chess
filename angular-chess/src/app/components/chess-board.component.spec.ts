import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '../types/board.t';

import { ChessBoardComponent } from './chess-board.component';
import {  PieceType } from '../types/pieces.t';

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
});

