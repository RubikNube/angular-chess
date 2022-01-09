import { BinaryOperator } from "@angular/compiler";
import { TestBed } from "@angular/core/testing";
import { MoveGenerationService } from "../services/move-generation.service";
import { Board, Color, Position } from "../types/board.t";
import BoardUtils from "./board.utils";

describe('BoardUtils', () => {
    let moveGenerationService: MoveGenerationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        moveGenerationService = TestBed.inject(MoveGenerationService);
    });

    it('should be created', () => {
        expect(moveGenerationService).toBeTruthy();
    });

    it('calculateAttackedSquares should generate attacked squares for queen and king', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/7q/8/7P/4K3 w - - 0 1");
        let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(moveGenerationService, board, Color.BLACK);

        expect(attackedSquares).toContain({ column: 5, row: 1 });
        expect(attackedSquares).toContain({ column: 8, row: 2 });
    });
});