import { Position } from "../types/board.t";
import { Piece, PieceType } from "../types/pieces.t";
import { MoveGenerationHandler } from "./move-generation.handler";
import { MoveGenerationService } from "./move-generation.service";

export class MoveGenerationPawnHandler implements MoveGenerationHandler {

  constructor(public generationService: MoveGenerationService) {

  }

  canHandle(piece: Piece): boolean {
    return piece.type === PieceType.PAWN;;
  }

  getMoveSquares(piece: Piece): Position[] {
    console.log("getMoveSquares: " + JSON.stringify(piece));
    if (piece.position.row === 2) {
      return this.generationService.getFreeFrontSquares(piece, 2);
    }
    else {
      return this.generationService.getFreeFrontSquares(piece, 1);
    }
  }

  getCaptureSquares(piece: Piece): Position[] {
    console.log("getValidPawnMoves: " + JSON.stringify(piece));
    let fieldsToMove: Position[] = [];

    // left upper field
    let leftUpperField: Position = {
      row: piece.position.row + 1,
      column: piece.position.column - 1
    };

    // right upper field
    let rightUpperField: Position = {
      row: piece.position.row + 1,
      column: piece.position.column + 1
    };

    fieldsToMove.push(leftUpperField, rightUpperField);

    return fieldsToMove;
  }


}