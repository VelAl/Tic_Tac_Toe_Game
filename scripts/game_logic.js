export const players = { X: "X", O: "O" };

export const gameState = {
  IS_IN_PROCESS: "inProcess",
  IS_WIN: "isWin",
  IS_DRAW: "isDraw",
};

const initialBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const initialScore = { [players.X]: 0, draw: 0, [players.O]: 0 };

// prettier-ignore
const winSet = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[2, 0], [1, 1], [0, 2]],
];

export class TicTacToeLogic {
  currentPlayer;
  board;
  gameState;
  score;
  winLine;

  constructor(savedGame) {
    savedGame ? this.setSavedGame(savedGame) : this.startNewGame();
  }

  setSavedGame(savedGame) {
    this.currentPlayer = savedGame.currentPlayer;
    this.board = structuredClone(savedGame.board);
    this.score = structuredClone(savedGame.score);
    this.gameState = savedGame.gameState;
    this.winLine = savedGame.winLine;
  }

  startNewGame() {
    this.currentPlayer = players.X;
    this.board = structuredClone(initialBoard);
    this.gameState = gameState.IS_IN_PROCESS;
    this.score = this.score ? this.score : structuredClone(initialScore);
    this.winLine = undefined;
  }

  makeMove(y, x) {
    if (this.gameState !== gameState.IS_IN_PROCESS || this.board[y][x]) {
      return this.#_returnGame(false);
    }

    this.board[y][x] = this.currentPlayer;

    const winLine = this.#_checkWin();
    if (winLine) {
      this.score[this.currentPlayer] += 1;
      this.gameState = gameState.IS_WIN;
      this.winLine = winLine;

      return this.#_returnGame(true);
    }

    if (this.#_checkDraw()) {
      this.score.draw += 1;
      this.gameState = gameState.IS_DRAW;

      return this.#_returnGame(true);
    }

    this.#_switchPlayer();
    return this.#_returnGame(true);
  }

  computerMakesMove = () => {
    const coords = this.#_getComputerMove();
    if (!coords) {
      console.error(
        "Attempt to make a computer move when the game is not in a valid state."
      );
    } else {
      this.makeMove(...coords);
    }
  };

  #_checkWin() {
    return winSet.find((line) =>
      line.every(([y, x]) => this.board[y][x] === this.currentPlayer)
    );
  }

  #_checkDraw() {
    return this.board.every((row) => row.every((player) => player));
  }

  #_returnGame(isMoveValid) {
    return { game: this, isMoveValid };
  }

  #_switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === players.X ? players.O : players.X;
  }

  // The computer is always player 'O' and goes second.
  #_getComputerMove() {
    if (this.gameState !== gameState.IS_IN_PROCESS) return;

    let coordsToBlock; // cell coordinates to block apponent win

    const checkLine = (line) => {
      let player_X = [];
      let player_O = [];
      let empty = [];

      line.forEach(([y, x]) => {
        const cellValue = this.board[y][x];

        cellValue === players.O
          ? player_O.push([y, x])
          : cellValue === players.X
          ? player_X.push([y, x])
          : empty.push([y, x]);
      });

      if (player_O.length === 2 && empty.length === 1) {
        return empty[0];
      }

      if (player_X.length === 2 && empty.length === 1) {
        coordsToBlock = empty[0];
      }
    };

    for (let i = 0; i < winSet.length; i++) {
      const winCoords = checkLine(winSet[i]);
      if (winCoords) return winCoords;
    }

    if (coordsToBlock) return coordsToBlock;

    // prettier-ignore
    const prioritySimpleMoves = [[1,1],[0,0],[0,2],[2,0],[2,2],[0,1],[1,0],[2,1],[1,2]]
    //Search for coordinates of a more prioritized empty cell.
    return prioritySimpleMoves.find(([y, x]) => !this.board[y][x]);
  }

  // for saving and sharing data ommiting methods
  get toSave() {
    const { currentPlayer, board, gameState, score, winLine } = this;
    return { currentPlayer, board, gameState, score, winLine };
  }
}
