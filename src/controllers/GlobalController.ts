import { GlobalModel } from "../models/GlobalModel";
import { GlobalView } from "../views/GlobalView";
import { ClockController } from "./ClockController";
import { ClockView } from "../views/ClockView";

export class GlobalController {
  private model: GlobalModel;
  private view: GlobalView;
  private clockControllers: ClockController[] = [];

  constructor(
    model: GlobalModel,
    view: GlobalView,
    clockControllers: ClockController[]
  ) {
    this.model = model;
    this.view = view;
    this.clockControllers = clockControllers;

    this.view.onAddClock((timezoneOffset, clockType) =>
      this.addClock(timezoneOffset, clockType)
    );
  }

  setUpListeners() {
    this.clockControllers.forEach((clockController) => {
      const clockContainer = clockController.getView().getContainer();
      clockController
        .getView()
        .onRemoveClock(() => this.removeClock(clockController, clockContainer));
    });
  }

  private addClock(timezoneOffset: number, clockType: string) {
    const newElement = this.view.addClockView(clockType);
    const newModel = this.model.addClock(timezoneOffset, clockType);
    const newView = new ClockView(newElement, newModel);
    new ClockController(newModel, newView);
  }

  private removeClock(
    clockController: ClockController,
    clockContainer: HTMLElement
  ) {
    this.model.removeClock(clockController.getModel());
  }
}
