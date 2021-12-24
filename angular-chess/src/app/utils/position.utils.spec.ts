import { TestBed } from '@angular/core/testing';
import { Position } from '../types/board.t';
import PositionUtils from './position.utils';

describe('PositionUtils', () => {
    let pos1 = { row: 1, column: 1 };
    let posNotInArray = { row: 2, column: 2 };
    let positions: Position[] = [{ row: 1, column: 1 }];


    it('includes should return true if position is found in array.', () => {
        expect(PositionUtils.includes(positions, pos1)).toBeTrue();
    });

    it('includes should return false if position is found in array.', () => {
        expect(PositionUtils.includes(positions, posNotInArray)).toBeFalse();
    });
});