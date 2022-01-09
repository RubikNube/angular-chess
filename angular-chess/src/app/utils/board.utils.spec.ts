import { BinaryOperator } from "@angular/compiler";
import { TestBed } from "@angular/core/testing";
import { MoveGenerationService } from "../services/move-generation.service";
import { Board, Color, Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import BoardUtils from "./board.utils";
import PositionUtils from "./position.utils";

describe('BoardUtils', () => {
    let moveGenerationService: MoveGenerationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        moveGenerationService = TestBed.inject(MoveGenerationService);
    });

    it('should be created', () => {
        expect(moveGenerationService).toBeTruthy();
    });

    it('calculateAttackedSquares should generate attacked squares for queen', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/7q/8/7P/4K3 w - - 0 1");
        let attackedSquares: Position[] = BoardUtils.calculateAttackedSquares(moveGenerationService, board, Color.BLACK);

        expect(attackedSquares).toContain({ column: 5, row: 1 });
        expect(attackedSquares).toContain({ column: 8, row: 2 });
    });

    it('isProtected should return true if piece is protected by own piece', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/1b6/8/8/8/8/6q1/4K3 w - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: { column: 7, row: 2 } };

        expect(BoardUtils.isProtected(moveGenerationService, board, queen)).toBeTrue();
    });

    it('isProtected should return false if piece is not protected by own piece', () => {
        let board: Board = BoardUtils.loadBoardFromFen("4k3/8/8/8/8/8/6q1/4K3 w - - 0 1");
        let queen: Piece = { type: PieceType.QUEEN, color: Color.BLACK, position: { column: 7, row: 2 } };

        expect(BoardUtils.isProtected(moveGenerationService, board, queen)).toBeFalse();
    });
});