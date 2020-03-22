import Scheduler, { EventType, Event } from './Scheduler';
import Random from './Random';

export default class Queue {
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
  state: number[];
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
    const accumulatedTime = this.state[this.length] ? this.state[this.length] : 0;
    this.globalTime = this.globalTime + time;
    this.state[this.length] = accumulatedTime + time;
  }

  execute(): void {
    const random = new Random(4, 4, this.maxIterations, 7);
    const scheduler = new Scheduler();

    scheduler.schedule(
      EventType.ARRIVAL,
      this.arrivalIntervalStart,
      this.arrivalIntervalEnd,
      random.generate()
    );

    let nextEvent: Event | undefined;

    for (let i = 0; i < this.maxIterations; i++) {
      nextEvent = scheduler.getNext();

      if (!nextEvent) {
        console.log('There is no new event');
        process.exit(0);
      }

      if (nextEvent.type === EventType.ARRIVAL) {
        //contabiliza tempo
        this.countTime(nextEvent.time);

        if (this.length < this.capacity) {
          this.length++;
          if (this.length <= this.servers) {
            scheduler.schedule(
              EventType.DEPARTURE,
              this.departureIntervalStart,
              this.departureIntervalEnd,
              random.generate(),
              this.globalTime
            );
          }
        } else {
          this.loss++;
        }
        scheduler.schedule(
          EventType.ARRIVAL,
          this.arrivalIntervalStart,
          this.arrivalIntervalEnd,
          random.generate(),
          this.globalTime
        );
      } else {
        this.countTime(nextEvent.time);

        this.length--;

        if (this.length >= this.servers) {
          scheduler.schedule(
            EventType.DEPARTURE,
            this.departureIntervalStart,
            this.departureIntervalEnd,
            random.generate(),
            this.globalTime
          );
        }
      }
    }

    console.log('loss', this.loss);
    console.log('global time', this.globalTime);
    console.log('state', this.state);
    this.results();
    process.exit(0);
  }

  results(): void {
    console.log('queue state | time | probability');
    for (let i = 0; i < this.state.length; i++) {
      console.log(`${i} | ${this.state[i]} | ${(this.state[i] / this.globalTime) * 100}%`);
    }
    console.log(`total | ${this.globalTime} | 100% `);
  }

}