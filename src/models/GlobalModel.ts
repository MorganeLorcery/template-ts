import { ClockModel } from "./ClockModel";

export class GlobalModel {
  private clocks: ClockModel[] = [];
  private observers: Array<() => void>;

  constructor() {
    this.observers = [];
  }

  addClock(timezoneOffset: number, clockType: string): ClockModel {
    const newClock = new ClockModel(timezoneOffset, clockType);
    this.clocks.push(newClock);
    return newClock;
  }

  getClocks() {
    return this.clocks;
  }

  removeClock(clock: ClockModel) {
    const index = this.clocks.indexOf(clock);
    if (index !== -1) {
      this.clocks.splice(index, 1);
    }
  }

  private notify() {
    this.observers.forEach((callback) => callback());
  }
}
