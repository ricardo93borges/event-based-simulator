import Scheduler, { EventType, Event } from './Scheduler';
import Random from './Random';

export interface QueueParams {
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
  totalIterations: number;
  random: Random;
  scheduler: Scheduler;
}
export default class Queue {
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
  state: number[];
  totalIterations: number;
  length: number;
  globalTime: number;
  loss: number;
  random: Random;
  scheduler: Scheduler;

  constructor(params: QueueParams) {
    this.arrivalIntervalStart = params.arrivalIntervalStart;
    this.arrivalIntervalEnd = params.arrivalIntervalEnd;
    this.departureIntervalStart = params.departureIntervalStart;
    this.departureIntervalEnd = params.departureIntervalEnd;
    this.servers = params.servers;
    this.capacity = params.capacity;
    this.state = [];
    this.totalIterations = params.totalIterations;
    this.length = 0;
    this.globalTime = 0;
    this.loss = 0;
    this.random = params.random;
    this.scheduler = params.scheduler;
  }

  countTime(time: number): void {
    const accumulatedTime = this.state[this.length] ? this.state[this.length] : 0;
    const delta = time - this.globalTime;
    this.globalTime = this.globalTime + delta;
    this.state[this.length] = accumulatedTime + delta;
  }

  execute(): void {
    let nextEvent: Event | undefined;

    for (let i = 0; i < this.totalIterations; i++) {
      nextEvent = this.scheduler.getNext();

      if (!nextEvent) {
        console.log('There is no new event');
        return;
      }

      if (nextEvent.type === EventType.ARRIVAL) {
        this.countTime(nextEvent.time);

        if (this.length < this.capacity) {
          this.length++;
          if (this.length <= this.servers) {
            const randomNumber = this.random.generate();
            this.scheduler.schedule(
              EventType.DEPARTURE,
              this.departureIntervalStart,
              this.departureIntervalEnd,
              randomNumber,
              this.globalTime
            );
          }
        } else {
          this.loss++;
        }
        const randomNumber = this.random.generate();
        this.scheduler.schedule(
          EventType.ARRIVAL,
          this.arrivalIntervalStart,
          this.arrivalIntervalEnd,
          randomNumber,
          this.globalTime
        );
      } else {
        this.countTime(nextEvent.time);

        this.length--;

        if (this.length >= this.servers) {
          const randomNumber = this.random.generate();
          this.scheduler.schedule(
            EventType.DEPARTURE,
            this.departureIntervalStart,
            this.departureIntervalEnd,
            randomNumber,
            this.globalTime
          );
        }
      }
    }
  }
}
