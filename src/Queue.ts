import Scheduler, { EventType, Event } from './Scheduler';
import Random from './Random';

export default class Queue {
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
  state: Event[];
  maxIterations: number;
  length: number;
  globalTime: number;
  loss: number;

  constructor(
    arrivalIntervalStart: number,
    arrivalIntervalEnd: number,
    departureIntervalStart: number,
    departureIntervalEnd: number,
    servers: number,
    capacity: number,
    maxIterations: number) {
    this.arrivalIntervalStart = arrivalIntervalStart;
    this.arrivalIntervalEnd = arrivalIntervalEnd;
    this.departureIntervalStart = departureIntervalStart;
    this.departureIntervalEnd = departureIntervalEnd;
    this.servers = servers;
    this.capacity = capacity;
    this.state = [];
    this.maxIterations = maxIterations;
    this.length = 0;
    this.globalTime = 0;
    this.loss = 0;
  }

  countTime(time: number): void {
    const accumulatedTime = this.state[this.length] ? this.state[this.length].time : 0;
    this.globalTime = (this.globalTime - time) + accumulatedTime;
  }

  execute(): void {
    const random = new Random(4, 4, this.maxIterations, 7);
    const scheduler = new Scheduler();

    let randomNumber = random.generate();
    scheduler.schedule(EventType.ARRIVAL, this.arrivalIntervalStart, this.arrivalIntervalEnd, randomNumber);

    let nextEvent: Event | undefined;

    for (let i = 0; i < this.maxIterations; i++) {
      nextEvent = scheduler.getNext();

      if (!nextEvent) {
        console.log('There is no new event');
        process.exit(0);
      }

      this.state[this.length] = nextEvent;

      if (nextEvent.type === EventType.ARRIVAL) {
        //contabiliza tempo
        this.countTime(nextEvent.time);

        if (this.length < this.capacity) {
          this.length++;
          if (this.length <= this.servers) {
            randomNumber = random.generate();
            scheduler.schedule(EventType.DEPARTURE, this.departureIntervalStart, this.departureIntervalEnd, randomNumber);
          }
        } else {
          this.loss++;
        }
        randomNumber = random.generate();
        scheduler.schedule(EventType.ARRIVAL, this.arrivalIntervalStart, this.arrivalIntervalEnd, randomNumber);
      } else {
        this.countTime(nextEvent.time);

        this.length--;

        if (this.length >= this.servers) {
          randomNumber = random.generate();
          scheduler.schedule(EventType.DEPARTURE, this.departureIntervalStart, this.departureIntervalEnd, randomNumber);
        }
      }
    }

    console.log('loss', this.loss);
    console.log('global time', this.globalTime);
    console.log('state', this.state);
    process.exit(0);
  }

}