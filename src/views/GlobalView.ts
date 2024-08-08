export class GlobalView {
  private container: HTMLElement;
  private clockContainer: HTMLElement;
  private timezoneDropdown: HTMLSelectElement;
  private addClockButton: HTMLButtonElement;

  private addClockListeners: Array<
    (timezoneOffset: number, clockType: string) => void
  >;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
    this.clockContainer = document.querySelector(".all-clocks-container")!;
    this.timezoneDropdown = document.getElementById(
      "timezoneDropdown"
    ) as HTMLSelectElement;
    this.addClockButton = document.getElementById(
      "addClockButton"
    ) as HTMLButtonElement;

    this.addClockListeners = [];

    this.setupEventListeners();
    this.makeClockDraggable();
  }

  private setupEventListeners() {
    this.addClockButton.addEventListener("click", () =>
      this.handleAddClockButtonClick()
    );
  }

  private handleAddClockButtonClick() {
    const timezoneOffset = parseInt(this.timezoneDropdown.value);
    const clockType = (
      document.getElementById("clockTypeDropdown") as HTMLSelectElement
    ).value;
    this.addClockListeners.forEach((callback) =>
      callback(timezoneOffset, clockType)
    );
  }

  addClockView(clockType: string) {
    const newClock = document.createElement("div");
    newClock.classList.add("grid");
    newClock.id = `clockContainer${document.querySelectorAll(".grid").length}`;
    newClock.draggable = true;
    if (clockType === "digital") {
      newClock.innerHTML = `<div class="clock-container">
                    <div class="button-container">
                        <button id="modeButton">Mode</button>
                        <button id="increaseButton">Increase</button>
                        <button id="removeButton">X</button>
                    </div>
                    <div id="clock">
                        <span id="hours">00</span>:<span id="minutes">00</span>:<span
                            id="seconds"
                            >00</span
                        ><span id="suffix"></span>
                    </div>
                    <div class="button-container">
                        <button id="lightButton">Light</button>
                        <button id="formatButton">AM/PM - 24H</button>
                        <button id="resetButton">Reset</button>
                    </div>
                </div>`;
    } else if (clockType === "analog") {
      newClock.innerHTML = `
            <div class="clock-container">
                <button id="removeButton" class="remove-analog-button">X</button>
                <div class="clock">
                    <div class="clock-face">
                        <div id="hours" class="hand hour-hand"></div>
                        <div id="minutes" class="hand minute-hand"></div>
                        <div id="seconds" class="hand second-hand"></div>
                        <div class="center-dot"></div>
                        <div class="hours-markers">
                            <div class="hour-marker" style="transform: rotate(0deg) translateY(-100px); background-color: red"></div>
                            <div class="hour-marker" style="transform: rotate(30deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(60deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(90deg) translateY(-100px); background-color: red"></div>
                            <div class="hour-marker" style="transform: rotate(120deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(150deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(180deg) translateY(-100px); background-color: red"></div>
                            <div class="hour-marker" style="transform: rotate(210deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(240deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(270deg) translateY(-100px); background-color: red"></div>
                            <div class="hour-marker" style="transform: rotate(300deg) translateY(-100px);"></div>
                            <div class="hour-marker" style="transform: rotate(330deg) translateY(-100px);"></div>
                        </div>
                    </div>
                </div>
             </div>
          </div>`;
    }

    const element = this.clockContainer.appendChild(newClock);
    this.makeClockDraggable();
    return element;
  }

  onAddClock(
    callback: (timezoneOffset: number, typeClock: string) => void
  ) {
    this.addClockListeners.push(callback);
  }

  private makeClockDraggable() {
    const clocks = document.querySelectorAll(".grid");
    clocks.forEach((clock) => {
      clock.addEventListener("dragstart", this.handleDragStart);
      clock.addEventListener("dragover", this.handleDragOver);
      clock.addEventListener("drop", this.handleDrop);
    });
  }

  private handleDragStart(e: DragEvent) {
    const targetElement = e.target as HTMLElement;
    e.dataTransfer.setData("text/plain", targetElement.id);
    e.dataTransfer.effectAllowed = "move";
  }

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedId);
    const targetElement = (e.target as HTMLElement).closest(".grid");

    if (draggedElement !== targetElement) {
      const container = document.getElementById('allClocksContainer');
      const draggedIndex = Array.from(container.children).indexOf(
        draggedElement
      );
      const targetIndex = Array.from(container.children).indexOf(targetElement);

      if (draggedIndex < targetIndex) {
        container.insertBefore(draggedElement, targetElement.nextSibling);
      } else {
        container.insertBefore(draggedElement, targetElement);
      }
    }
  }
}
