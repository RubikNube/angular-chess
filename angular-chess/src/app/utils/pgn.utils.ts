import { Move } from "../types/pieces.t";

export default class PgnUtils {
  public static extractMovesFromPgn(newPgn: string): Move[] {
    const moves: Move[] = [];

    const beginOfMovesIndex = newPgn.search(/\n\d../);
    const rawMoveString = newPgn.substring(beginOfMovesIndex);

    console.error(`index: ${beginOfMovesIndex} move string: ${rawMoveString} lenght: ${rawMoveString.length}`)

    const kingSideCastleRegEx = /O-O/;
    const queenSideCastleRegEx = /O-O-O/;
    const coordinateRegEx = /[a-h][1-8]/;
    const pieceCharRegEx = new RegExp(`(K|Q|R|B|N)([a-h]|[1-8])?(${coordinateRegEx.source})?`);
    const pieceRegEx = new RegExp(`${pieceCharRegEx.source}?${coordinateRegEx.source}`);
    const moveRegEx = new RegExp(`(${coordinateRegEx.source}|${pieceRegEx.source}|${kingSideCastleRegEx.source}|${queenSideCastleRegEx.source})`);
    const captureRegEx = new RegExp(`(${pieceCharRegEx.source}|[a-h])x${coordinateRegEx.source}`);
    const moveOrCaptureRegEx = new RegExp(`(${moveRegEx.source}|${captureRegEx.source})\\+?`);
    const moveGroupRegEx = `(\\d+\.${moveOrCaptureRegEx.source} ${moveOrCaptureRegEx.source}|\\d+\.${moveOrCaptureRegEx.source})`;
    console.error(`moveGroupRegEx: ${moveGroupRegEx}`)
    const moveStrings = [...rawMoveString.matchAll(new RegExp(moveGroupRegEx, 'gm'))];
    console.error(`moveStrings: ${moveStrings} moveStrings.lenght: ${moveStrings.length}`)


    for (const moveString in moveStrings) {
      console.error(`moveString: ${moveString}`)
    }




    return moves;
  }
}