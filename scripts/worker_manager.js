import { DataSaver } from "./local_storage_manager.js";

export class SharedWorkerManager extends DataSaver {
  #_updateUI;
  #_worker;
  static apiName = "Shared web worker";

  constructor(updateUI) {
    super("__tic_tac_toe_sw");
    this.#_updateUI = updateUI;
    this.#_worker = new SharedWorker("/scripts/worker.js");

    this.#_startListen();
  }

  #_startListen() {
    this.#_worker.port.start();
    this.#_worker.port.onmessage = this.#_swwMessageHandler;
  }
  finishListen() {
    this.#_worker.port.close();
  }

  saveGame(game) {
    this.saveGameToLocalStorage(game);
    this.#_worker.port.postMessage(game);
  }

  #_swwMessageHandler = (e) => {
    this.#_updateUI(e.data);
  };
}
