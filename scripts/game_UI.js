import { BroadcastChannelManager } from "./broadcast_channel_manager.js";
import { gameState, players, TicTacToeLogic } from "./game_logic.js";
import { LocalStorageManager } from "./local_storage_manager.js";
import { SharedWorkerManager } from "./worker_manager.js";

const playerSvg = {
  [players.X]: "./images/player_x.svg",
  [players.O]: "./images/player_o.svg",
};

const managers = {
  LocalStorageManager,
  SharedWorkerManager,
  BroadcastChannelManager,
};

export class TicTacToeUI {
  game;
  overlay;
  shareDataManager;
  timeoutID; // computer mooves with deleay

  constructor(managerName) {
    this.shareDataManager = new managers[managerName](this.#_updateAllGameUI);

    const savedGame = this.shareDataManager.getSavedGame();
    this.game = new TicTacToeLogic(savedGame);

    //if the game was closed before the computer could make its move.
    if (
      savedGame &&
      this.game.currentPlayer === players.O &&
      this.game.gameState === gameState.IS_IN_PROCESS
    ) {
      this.game.computerMakesMove();
      this.shareDataManager.saveGame(this.game.toSave);
    }

    this.#_beginGameRender();

    this.#_startHandlingMoves();
  }

  #_beginGameRender() {
    const overlay = this.#_createElement("div", [["id", "overlay"]]);
    this.overlay = overlay;

    const closeBtn = this.#_createElement("button", [["id", "closeBtn"]]);
    const closeIcn = this.#_createElement("img", [
      ["src", "./images/close.svg"],
    ]);
    closeBtn.append(closeIcn);
    closeBtn.addEventListener("click", this.#_closeGame);
    overlay.append(closeBtn);

    const gameBlock = this.#_createElement("div", [["id", "game"]]);
    overlay.append(gameBlock);

    this.#_displayScore(gameBlock);
    this.#_updScoreUI();

    const board = this.#_createElement("div", [["id", "board"]]);
    gameBlock.append(board);

    this.game.board.forEach((row, y) =>
      row.forEach((_, x) => {
        const cellDiv = this.#_createElement("div", [
          ["data-y", y],
          ["data-x", x],
        ]);
        board.append(cellDiv);
      })
    );
    this.#_updBoardUI();
    this.#_displayFooter();

    const apiNameDiv = this.#_createElement("div", [["id", "overlayApiName"]]);
    apiNameDiv.innerText = Object.getPrototypeOf(
      this.shareDataManager
    ).constructor.apiName;

    overlay.append(apiNameDiv);
    document.body.append(overlay);
  }

  #_startHandlingMoves() {
    const board = this.overlay.querySelector("#board");
    board.addEventListener("click", (e) => {
      if (this.game.currentPlayer === players.O) return; // computer mooves

      const cell = e.target.closest("#board div");
      if (!cell) return; // click not on cell

      const [y, x] = [+cell.dataset.y, +cell.dataset.x];

      const { isMoveValid } = this.game.makeMove(y, x);
      if (!isMoveValid) return;

      this.#_updAfterMove();

      if (this.game.gameState === gameState.IS_IN_PROCESS) {
        this.timeoutID = setTimeout(() => {
          this.game.computerMakesMove();
          this.#_updAfterMove();
        }, 500);
      }
    });
  }

  #_updAfterMove = () => {
    this.shareDataManager.saveGame(this.game.toSave);

    if (this.game.gameState !== gameState.IS_IN_PROCESS) {
      this.#_updScoreUI();
    }
    this.#_updBoardUI();
    this.#_displayFooter();
  };

  #_displayScore(gameBlock) {
    const scoreWrap = this.#_createElement("div", [["id", "scoreWrap"]]);

    Object.keys(this.game.score).forEach(() => {
      const div = this.#_createElement("div");
      scoreWrap.append(div);
    });

    gameBlock.prepend(scoreWrap);
  }

  #_updScoreUI() {
    const itms = this.overlay.querySelectorAll("#scoreWrap div");
    Object.keys(this.game.score).forEach((key, i) => {
      itms[i].innerText = `${players[key] ? "player" : ""} ${key}\n${
        this.game.score[key]
      }`;
    });
  }

  #_displayFooter() {
    const footer = this.#_createElement("div", [["id", "footer"]]);
    const gameBlock = this.overlay.querySelector("#game");
    gameBlock.querySelector("#footer")?.remove();

    const infoBlock = this.#_createElement("div");

    switch (this.game.gameState) {
      case gameState.IS_IN_PROCESS: {
        infoBlock.innerText = `move`;
        this.#_displayPlayerInCell(infoBlock, this.game.currentPlayer);
        footer.prepend();
        break;
      }

      case gameState.IS_WIN: {
        infoBlock.innerText = `winner`;
        this.#_displayPlayerInCell(infoBlock, this.game.currentPlayer);
        this.#_displayResetBtn(footer);
        break;
      }

      case gameState.IS_DRAW: {
        infoBlock.innerText = `draw`;
        this.#_displayResetBtn(footer);
      }
    }
    footer.prepend(infoBlock);
    gameBlock.append(footer);
  }

  #_displayResetBtn(footer) {
    const btn = this.#_createElement("button", [["id", "reset_btn"]]);
    btn.innerText = "new game";
    btn.addEventListener("click", this.#_resetGame);

    footer.append(btn);
  }

  #_displayPlayerInCell(cellNode, player) {
    const img = this.#_createElement("img", [
      ["src", playerSvg[player]],
      ["class", player],
    ]);
    cellNode.append(img);
  }

  #_updBoardUI() {
    const cells = this.overlay.querySelectorAll("#board div");

    cells.forEach((cell) => {
      const y = cell.dataset.y;
      const x = cell.dataset.x;

      if (!this.game.board[y][x]) {
        cell.innerHTML = "";
      } else {
        const img = this.#_createElement("img", [
          ["src", playerSvg[this.game.board[y][x]]],
          ["class", this.game.board[y][x]],
        ]);
        cell.replaceChildren(img);

        const isNotWinCell =
          this.game.winLine &&
          !this.game.winLine.some(([Y, X]) => Y === +y && X === +x);

        isNotWinCell && img.classList.add("fadeOX");
      }
    });
  }

  #_resetGame = () => {
    this.game.startNewGame();
    this.shareDataManager.saveGame(this.game.toSave);

    this.#_updBoardUI();
    this.#_displayFooter();
  };

  // This ensures that changes made in one tab are reflected in other open tabs
  #_updateAllGameUI = (updatedGame) => {
    this.game.setSavedGame(updatedGame);

    this.#_updScoreUI();
    this.#_updBoardUI();
    this.#_displayFooter();
  };

  #_closeGame = () => {
    this.overlay.remove();
    this.game = null;
    this.overlay = null;
    this.shareDataManager.finishListen();
    this.shareDataManager = null;
    this.timeoutID && clearTimeout(this.timeoutID);
  };

  #_createElement(tagName, attributes) {
    const el = document.createElement(tagName);
    attributes?.forEach(([name, value]) => el.setAttribute(name, value));
    return el;
  }
}
