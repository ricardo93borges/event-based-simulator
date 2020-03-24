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

  constructor() {
    this.events = [];
  }

  calculateTime = (start: number, end: number, random: number): number => {
    return (end - start) * random + start;
  }

  schedule = (type: EventType, start: number, end: number, random: number): void => {
    this.events.push({
      type,
      time: this.calculateTime(start, end, random)
    });
  }

  getNext = (): Event | undefined => {
    this.events.sort((a, b) => a.time > b.time ? 1 : -1);
    return this.events.shift();
  }

}