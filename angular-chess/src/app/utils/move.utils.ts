import { Move } from "../types/pieces.t";
import PositionUtils from "./position.utils";

export default class MoveUtils {
  public static moveToUci(move: Move): string {
    let uci: string = PositionUtils.getCoordinate(move.from) + PositionUtils.getCoordinate(move.to);
    if (move.promotedPiece !== undefined) {
      uci += move.promotedPiece.type;
    }
    return uci;
  }
}