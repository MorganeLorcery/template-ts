import { ClockModel } from "../models/ClockModel";
import { ClockView } from "../views/ClockView";

export class ClockController {
  private model: ClockModel;
  private view: ClockView;

  constructor(model: ClockModel, view: ClockView) {
    this.model = model;
    this.view = view;

    this.updateView();

    this.setupListeners();
  }

  private setupListeners() {
    this.view.onModeChange(() => this.handleModeChange());
    this.view.onIncrease(() => this.handleIncreaseTime());
    this.view.onLightToggle(() => this.handleLightToggle());
    this.view.onFormatChange(() => this.handleFormatChange());
    this.view.onReset(() => this.handleReset());
    this.view.onRemoveClock(() => this.handleRemoveClock());
  }

  private updateView() {
    if (this.model.getClockType() === "digital")
      this.view.displayTime(this.model.getTime());
    else this.view.displayAnalogTime(this.model.getAnalogTime());
  }

  public handleModeChange() {
    this.model.setEditingMode(this.view.getEditMode());
    this.updateView();
  }

  public handleIncreaseTime() {
    this.model.increaseTime();
    this.updateView();
  }

  public handleLightToggle() {
    this.updateView();
  }

  private handleFormatChange() {
    this.model.toggleFormat();
    this.updateView();
  }

  private handleReset() {
    this.model.resetTime();
    this.updateView();
  }

  private handleRemoveClock() {
    this.updateView();
  }

  getModel(): ClockModel {
    return this.model;
  }

  getView(): ClockView {
    return this.view;
  }
}
