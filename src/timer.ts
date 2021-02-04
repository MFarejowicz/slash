export class Timer {
  private startTime?: Date;
  private stopTime?: Date;
  private maxTime: number;

  constructor(max: number) {
    this.maxTime = max;
  }

  start() {
    this.startTime = new Date();
  }

  stop() {
    this.stopTime = new Date();
  }

  reset() {
    this.startTime = undefined;
    this.stopTime = undefined;
  }

  getTime() {
    if (this.startTime && this.stopTime) {
      return this.stopTime?.getTime() - this.startTime?.getTime();
    }

    return this.maxTime;
  }
}
