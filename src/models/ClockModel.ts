export class ClockModel {
  private time: Date;
  private isEditing: number; // 0: Non éditable, 1: Édition des heures, 2: Édition des minutes
  private intervalId: NodeJS.Timeout | null;
  private observers: Array<() => void>;
  private timezoneOffset: number;
  private is24HourFormat: boolean;
  private clockType: string;

  constructor(timezoneOffset: number, clockType: string) {
    this.time = new Date();
    this.isEditing = 0;
    this.timezoneOffset = timezoneOffset;
    this.time.setMinutes(this.time.getMinutes() + timezoneOffset);
    this.is24HourFormat = true;
    this.clockType = clockType;
    this.intervalId = null;
    this.observers = [];
    this.startClock();
  }

  startClock() {
    this.intervalId = setInterval(() => {
      this.time.setSeconds(this.time.getSeconds() + 1);
        this.notify();
    }, 1000);
  }

  stopClock() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getTime() {
    let hours = this.time.getHours();
    let suffix = "";
    if (!this.is24HourFormat) {
      suffix = hours >= 12 ? " PM" : " AM";
      hours = hours >= 12 ? hours % 12 : hours;
    }
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: this.time.getMinutes().toString().padStart(2, "0"),
      seconds: this.time.getSeconds().toString().padStart(2, "0"),
      suffix: suffix,
    };
  }

  getAnalogTime() {
    return {
      hours: this.time.getHours(),
      minutes: this.time.getMinutes(),
      seconds: this.time.getSeconds(),
    };
  }

  setEditingMode(mode: number) {
    this.isEditing = mode;
    this.notify();
  }

  increaseTime() {
    if (this.isEditing === 1) {
      // Édition des heures
      let hours = this.time.getHours();
      hours = (hours + 1) % 24;
      this.time.setHours(hours);
    } else if (this.isEditing === 2) {
      // Édition des minutes
      let minutes = this.time.getMinutes();
      if (minutes === 59) {
        this.time.setMinutes(0);
        let hours = this.time.getHours();
        hours = (hours + 1) % 24;
        this.time.setHours(hours);
      } else {
        this.time.setMinutes(minutes + 1);
      }
    }
    this.notify();
  }

  toggleFormat() {
    this.is24HourFormat = !this.is24HourFormat;
    this.notify();
  }

  resetTime() {
    this.time = new Date(new Date().getTime() + this.timezoneOffset * 60000);
    this.notify();
  }

  getEditMode() {
    return this.isEditing;
  }

  getClockType() {
    return this.clockType;
  }

  private notify() {
    this.observers.forEach((callback) => callback());
  }

  public addObserver(callback: () => void) {
    this.observers.push(callback);
  }
}
