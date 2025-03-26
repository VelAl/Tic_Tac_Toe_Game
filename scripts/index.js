import { BroadcastChannelManager } from "./broadcast_channel_manager.js";
import { TicTacToeUI } from "./game_UI.js";
import { LocalStorageManager } from "./local_storage_manager.js";
import { SharedWorkerManager } from "./worker_manager.js";

const dataManagers = [
  {
    name: LocalStorageManager.apiName,
    managerClassName: LocalStorageManager.name,
    check: () => {
      try {
        window.localStorage.setItem("test", "test");
        window.localStorage.removeItem("test");
      } catch {
        return false;
      }
      return true;
    },
  },
  {
    name: SharedWorkerManager.apiName,
    managerClassName: SharedWorkerManager.name,
    check: () => !!window.SharedWorker,
  },
  {
    name: BroadcastChannelManager.apiName,
    managerClassName: BroadcastChannelManager.name,
    check: () => !!window.BroadcastChannel,
  },
];

dataManagers.forEach(({ check, managerClassName, name }, i) => {
  const startGameCard = document.createElement("div");
  startGameCard.classList.add("startGameCard");

  const nameHeader = document.createElement("h3");
  nameHeader.innerText = name;
  startGameCard.append(nameHeader);

  const btn = document.createElement("button");
  btn.innerText = "start game";

  const isSupported = check();
  btn.disabled = !isSupported;
  btn.addEventListener("click", () => new TicTacToeUI(managerClassName));

  startGameCard.append(btn);

  if (!isSupported) {
    const warnDiv = document.createElement("div");
    warnDiv.innerText = `API ${name} is not supported in your browser.`;
    startGameCard.append(warnDiv);
  }

  document.body.append(startGameCard);
});
