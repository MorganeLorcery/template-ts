import { ClockModel } from "./models/ClockModel";
import { ClockView } from "./views/ClockView";
import { ClockController } from "./controllers/ClockController";

import { GlobalModel } from "./models/GlobalModel";
import { GlobalView } from "./views/GlobalView";
import { GlobalController } from "./controllers/GlobalController";

import "./index.css";

window.onload = () => {
  const model = new ClockModel(0, "digital");
  const view = new ClockView(document.getElementById("clockContainer"), model);
  const controller = new ClockController(model, view);
  const globalModel = new GlobalModel();
  const globalView = new GlobalView("app");
  new GlobalController(globalModel, globalView, [controller]);
};
