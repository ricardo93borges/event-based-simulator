export enum EventType {
  ARRIVAL = 'ARRIVAL',
  DEPARTURE = 'DEPARTURE'
}

export interface Event {
  type: EventType;
  time: number;
}

export default class Scheduler {
  events: Event[];
  history: Event[];

  constructor() {
    this.events = [];
    this.history = [];
  }

  calculateTime = (start: number, end: number, random: number): number => {
    return (end - start) * random + start;
  }

  schedule = (type: EventType, start: number, end: number, random: number, globalTime: number): void => {
    const time = globalTime + this.calculateTime(start, end, random);

    this.events.push({
      type,
      time
    });
    this.history.push({
      type,
      time
    });
  }

  getNext = (): Event | undefined => {
    this.events.sort((a, b) => a.time > b.time ? 1 : -1);
    return this.events.shift();
  }

}