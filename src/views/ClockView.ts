import { Matrix3x3 } from "../matrice/Matrix3x3";
import { Point } from "../matrice/Point";
import { ClockModel } from "../models/ClockModel";

export class ClockView {
  private model: ClockModel;
  private hoursElement: HTMLElement;
  private minutesElement: HTMLElement;
  private secondsElement: HTMLElement;
  private clockElement: HTMLElement;
  private suffixElement: HTMLElement;
  private blinkInterval: NodeJS.Timeout | null;
  private editMode: number; // 0: Non éditable, 1: Édition des heures, 2: Édition des minutes
  private isLightOn: boolean;

  private modeChangeListeners: Array<() => void>;
  private increaseListeners: Array<() => void>;
  private lightListeners: Array<() => void>;
  private formatListeners: Array<() => void>;
  private resetListeners: Array<() => void>;
  private removeClockListeners: Array<() => void>;

  constructor(clockElement: HTMLElement, model: ClockModel) {
    this.model = model;
    this.clockElement = clockElement;

    this.hoursElement = clockElement.querySelector("#hours") as HTMLElement;
    this.minutesElement = clockElement.querySelector("#minutes") as HTMLElement;
    this.secondsElement = clockElement.querySelector("#seconds") as HTMLElement;
    this.suffixElement = clockElement.querySelector("#suffix") as HTMLElement;
    this.model.addObserver(() => this.updateView());
    this.editMode = 0;
    this.blinkInterval = null;
    this.isLightOn = false;

    this.modeChangeListeners = [];
    this.increaseListeners = [];
    this.lightListeners = [];
    this.formatListeners = [];
    this.resetListeners = [];
    this.removeClockListeners = [];

    this.setupEventListeners();
  }

  private updateView() {
    if (this.model.getClockType() === "digital") {
      const time = this.model.getTime();
      this.hoursElement.innerText = time.hours;
      this.minutesElement.innerText = time.minutes;
      this.secondsElement.innerText = time.seconds;
    } else {
      const time = this.model.getAnalogTime();
      this.displayAnalogTime(time);
    }
  }

  private setupEventListeners() {
    (
      this.clockElement.querySelector("#modeButton") as HTMLElement
    )?.addEventListener("click", () => this.handleModeButtonClick());
    (
      this.clockElement.querySelector("#increaseButton") as HTMLElement
    )?.addEventListener("click", () => this.handleIncreaseButtonClick());
    (
      this.clockElement.querySelector("#lightButton") as HTMLElement
    )?.addEventListener("click", () => this.handleLightButtonClick());
    (
      this.clockElement.querySelector("#formatButton") as HTMLElement
    )?.addEventListener("click", () => this.handleFormatButtonClick());
    (
      this.clockElement.querySelector("#resetButton") as HTMLElement
    )?.addEventListener("click", () => this.handleResetButtonClick());
    (
      this.clockElement.querySelector("#removeButton") as HTMLElement
    )?.addEventListener("click", () => this.handleRemoveButtonClick());
  }

  private handleModeButtonClick() {
    this.editMode = (this.editMode + 1) % 3;
    this.applyBlinking();
    this.modeChangeListeners.forEach((callback) => callback());
  }

  private handleIncreaseButtonClick() {
    this.increaseListeners.forEach((callback) => callback());
  }

  private handleLightButtonClick() {
    this.isLightOn = !this.isLightOn;
    this.applyLightToggle();
    this.lightListeners.forEach((callback) => callback());
  }

  private handleFormatButtonClick() {
    this.formatListeners.forEach((callback) => callback());
  }

  private handleResetButtonClick() {
    this.resetListeners.forEach((callback) => callback());
  }

  private handleRemoveButtonClick() {
    this.clockElement.remove();
    this.removeClockListeners.forEach((callback) => callback());
  }

  private applyBlinking() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }

    if (this.editMode === 1) {
      this.blinkInterval = setInterval(() => {
        this.hoursElement.classList.toggle("blinking");
      }, 500);
    } else if (this.editMode === 2) {
      this.hoursElement.classList.remove("blinking");
      this.blinkInterval = setInterval(() => {
        this.minutesElement.classList.toggle("blinking");
      }, 500);
    } else {
      this.hoursElement.classList.remove("blinking");
      this.minutesElement.classList.remove("blinking");
    }
  }

  private applyLightToggle() {
    const container = this.clockElement.querySelector("#clock") as HTMLElement;
    if (container) {
      container.classList.toggle("clock-light-on", this.isLightOn);
    }
  }

  displayTime(time: {
    hours: string;
    minutes: string;
    seconds: string;
    suffix: string;
  }) {
    this.hoursElement.innerText = time.hours;
    this.minutesElement.innerText = time.minutes;
    this.secondsElement.innerText = time.seconds;
    this.suffixElement.innerText = time.suffix;
  }

  displayAnalogTime(time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) {
    // Convert degrees to radians for the Matrix3x3 functions
    const hoursRad =
      ((time.hours % 12) * Math.PI) / 6 + ((time.minutes / 2) * Math.PI) / 180;
    const minutesRad = (time.minutes * Math.PI) / 30;
    const secondsRad = (time.seconds * Math.PI) / 30;

    // Create rotation matrices
    const hourRotation = Matrix3x3.rotation(hoursRad);
    const minuteRotation = Matrix3x3.rotation(minutesRad);
    const secondRotation = Matrix3x3.rotation(secondsRad);

    // Define the length of each hand
    const hourHandLength = 50;
    const minuteHandLength = 70;
    const secondHandLength = 90;

    // Define initial points for the hands
    const hourPoint = new Point(0, -hourHandLength);
    const minutePoint = new Point(0, -minuteHandLength);
    const secondPoint = new Point(0, -secondHandLength);

    // Apply rotations to points
    const rotatedHourPoint = hourRotation.transformPoint(hourPoint);
    const rotatedMinutePoint = minuteRotation.transformPoint(minutePoint);
    const rotatedSecondPoint = secondRotation.transformPoint(secondPoint);

    // Calculate degrees for CSS transform
    const hourDeg =
      (Math.atan2(rotatedHourPoint.getY(), rotatedHourPoint.getX()) * 180) /
        Math.PI +
      90;
    const minuteDeg =
      (Math.atan2(rotatedMinutePoint.getY(), rotatedMinutePoint.getX()) * 180) /
        Math.PI +
      90;
    const secondDeg =
      (Math.atan2(rotatedSecondPoint.getY(), rotatedSecondPoint.getX()) * 180) /
        Math.PI +
      90;

    // Apply rotation to each hand
    this.hoursElement.style.transform = `rotate(${hourDeg}deg)`;
    this.minutesElement.style.transform = `rotate(${minuteDeg}deg)`;
    this.secondsElement.style.transform = `rotate(${secondDeg}deg)`;
  }

  getEditMode(): number {
    return this.editMode;
  }

  onModeChange(callback: () => void) {
    this.modeChangeListeners.push(callback);
  }

  onIncrease(callback: () => void) {
    this.increaseListeners.push(callback);
  }

  onLightToggle(callback: () => void) {
    this.lightListeners.push(callback);
  }

  onFormatChange(callback: () => void) {
    this.formatListeners.push(callback);
  }

  onReset(callback: () => void) {
    this.resetListeners.push(callback);
  }

  onRemoveClock(callback: () => void) {
    this.removeClockListeners.push(callback);
  }

  getContainer(): HTMLElement {
    return this.clockElement;
  }
}
