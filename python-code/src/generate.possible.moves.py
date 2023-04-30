import getopt
import sys
import chess
import chess.engine
import os


def main(argv):
    engine_path = ''
    start_fen = ''
    depth = 0
    opts, args = getopt.getopt(argv, "he:f:d:", ["engine=", "fen=", "depth="])
    for opt, arg in opts:
        if opt == '-h':
            print('generate.possible.moves.py -e- <engine_path> -o <fen>')
            sys.exit()
        elif opt in ("-e", "--engine"):
            engine_path = str(arg)
        elif opt in ("-f", "--fen"):
            start_fen = str(arg)
        elif opt in ("-d", "--depth"):
            depth = int(arg)

    # Here we assume the engine file is in same folder as our python script
    # Let's try our code with the starting position of chess:
    board = chess.Board(start_fen)
    # Now make sure you give the correct location for your stockfish engine file
    # ...in the line that follows by correctly defining path
    engine = chess.engine.SimpleEngine.popen_uci(engine_path)

    move_sequences = generate_valid_move_sequences(board, depth)

    node_fens = []

    for move_sequence in move_sequences:
        copied_board = board.copy()
        for move in move_sequence:
            # execute the move on the copied board
            copied_board.push(move)
        node_fens.append(copied_board.fen())

    node_fens.sort()
    i = 0
    for fen in node_fens:
        i += 1
        print(str(i)+' '+fen + ' ' + show_move_sequence(move_sequences[i-1]))

    engine.quit()


def generate_valid_move_sequences(board, depth, moves=[]):
    if depth == 0:
        return [moves]
    else:
        valid_moves = list(board.legal_moves)
        move_sequences = []
        for move in valid_moves:
            board.push(move)
            move_sequences += generate_valid_move_sequences(
                board, depth - 1, moves + [move])
            board.pop()
        return move_sequences


def show_move_sequence(move_sequence):
    """Returns a string representation of the move sequence."""
    return '['+','.join([str(move) for move in move_sequence])+']'


if __name__ == '__main__':
    main(sys.argv[1:])
