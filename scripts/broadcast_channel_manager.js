import { DataSaver } from "./local_storage_manager.js";

export class BroadcastChannelManager extends DataSaver {
  #_updateUI;
  #_channel;
  #_channelID;
  static apiName = "Broadcast channel";

  constructor(updateUI) {
    super("__tic_tac_toe_bc");
    this.#_updateUI = updateUI;
    this.#_channel = new BroadcastChannel(this.key);
    this.#_channelID = (Math.random() * 1e7).toFixed();

    this.#_channel.onmessage = this.#_channelMessageHandler;
  }

  finishListen() {
    this.#_channel.close();
  }

  saveGame(game) {
    this.saveGameToLocalStorage(game);
    this.#_channel.postMessage({ id: this.#_channelID, game });
  }

  #_channelMessageHandler = ({ data: { id, game } }) => {
    if (id !== this.#_channelID) {
      this.#_updateUI(game);
    }
  };
}
