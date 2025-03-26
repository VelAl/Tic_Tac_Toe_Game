export class DataSaver {
  key;

  constructor(key) {
    this.key = key;
  }

  getSavedGame() {
    const saved = localStorage.getItem(this.key);

    if (!saved) return;
    return JSON.parse(saved);
  }

  saveGameToLocalStorage(game) {
    localStorage.setItem(this.key, JSON.stringify(game));
  }
}

export class LocalStorageManager extends DataSaver {
  #_updateUI;
  static apiName = "Local storage";

  constructor(updateUI) {
    super("__tic_tac_toe_ls");
    this.#_updateUI = updateUI;
    this.#_startListen();
  }

  #_startListen() {
    window.addEventListener("storage", this.#_lsEventHandler);
  }
  finishListen() {
    window.removeEventListener("storage", this.#_lsEventHandler);
  }

  saveGame(game) {
    this.saveGameToLocalStorage(game);
  }

  #_lsEventHandler = (e) => {
    if (e.key === this.key) {
      this.#_updateUI(JSON.parse(e.newValue));
    }
  };
}
