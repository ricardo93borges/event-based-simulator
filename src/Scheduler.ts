export enum EventType {
  ARRIVAL = 'ARRIVAL',
  DEPARTURE = 'DEPARTURE',
  TRANSITION = 'TRANSITION',
}

export interface Event {
  type: EventType;
  time: number;
  source?: number;
  target?: number;
}

export interface ScheduleParams {
  type: EventType;
  start: number;
  end: number;
  random: number;
  globalTime: number;
  source?: number;
  target?: number;
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

  schedule = (scheduleParams: ScheduleParams): void => {
    const time = scheduleParams.globalTime + this.calculateTime(
      scheduleParams.start,
      scheduleParams.end,
      scheduleParams.random
    );

    this.events.push({
      time,
      type: scheduleParams.type,
    });
    this.history.push({
      time,
      type: scheduleParams.type,
    });
  }

  getNext = (): Event | undefined => {
    this.events.sort((a, b) => a.time > b.time ? 1 : -1);
    return this.events.shift();
  }

}