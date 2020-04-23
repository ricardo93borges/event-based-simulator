import Queue from './Queue';
import Random from './Random';
import Scheduler, { EventType } from './Scheduler';

// TODO read entry file
// TODO handle queue infinity capacity
// TODO tandem queues
// TODO queues with routing probability

export default class Simulator {
  random: Random;
  totalIterations: number;
  scheduler: Scheduler;
  globalTime: number;
  queues: Queue[];

  constructor(totalIterations: number) {
    this.queues = this.setupQueues();
    this.random = this.setupRandom();
    this.scheduler = this.setupScheduler();
    this.totalIterations = totalIterations;
    this.globalTime = 0;
  }

  setupRandom(): Random {
    const a = 12312431;
    const c = 17;
    const m = 2147483648;
    return new Random(a, c, m, 7);
  }

  setupScheduler(): Scheduler {
    const scheduler = new Scheduler();
    scheduler.events.push({ type: EventType.ARRIVAL, time: 2 });
    return scheduler;
  }

  setupQueues(): Queue[] {
    const queue = new Queue({
      id: 1,
      arrivalIntervalStart: 1,
      arrivalIntervalEnd: 2,
      departureIntervalStart: 3,
      departureIntervalEnd: 6,
      servers: 1,
      capacity: 3,
    });
    return [queue];
  }

  printResults(queue: Queue): void {
    console.log(` Queue: ${queue.id}`);
    console.log('state | time | probability');
    for (let i = 0; i < queue.state.length; i++) {
      const percent = (queue.state[i] / this.globalTime) * 100;
      console.log(`${i} | ${queue.state[i].toFixed(4)} | ${percent.toFixed(4)}%`);
    }
    console.log(`total | ${this.globalTime.toFixed(4)} | 100% `);
    console.log('loss', queue.loss);
    console.log('global time', this.globalTime);
    console.log(' -------- ');
  }

  countTime(time: number): void {
    this.queues.forEach(queue => {
      const accumulatedTime = queue.state[queue.length] ? queue.state[queue.length] : 0;
      const delta = time - this.globalTime;
      this.globalTime = this.globalTime + delta;
      queue.state[queue.length] = accumulatedTime + delta;
    });
  }

  schedule(eventType: EventType, start: number, end: number): void {
    const random = this.random.generate();

    this.scheduler.schedule({
      start,
      end,
      random,
      type: eventType,
      globalTime: this.globalTime
    });
  }

  // TODO handle transition event
  run(): void {
    const queue1 = this.queues[0];
    for (let i = 0; i < this.totalIterations; i++) {

      const nextEvent = this.scheduler.getNext();

      if (!nextEvent) {
        console.log('There is no new event');
        return;
      }

      if (nextEvent.type === EventType.ARRIVAL) {
        this.countTime(nextEvent.time);

        if (queue1.length < queue1.capacity) {
          queue1.length++;
          if (queue1.length <= queue1.servers) {
            this.schedule(EventType.DEPARTURE, queue1.departureIntervalStart, queue1.departureIntervalEnd);
          }
        } else {
          queue1.loss++;
        }
        this.schedule(EventType.ARRIVAL, queue1.arrivalIntervalStart, queue1.arrivalIntervalEnd);
      } else {
        this.countTime(nextEvent.time);
        queue1.length--;

        if (queue1.length >= queue1.servers) {
          this.schedule(EventType.DEPARTURE, queue1.departureIntervalStart, queue1.departureIntervalEnd);
        }
      }
    }

    this.printResults(queue1);
  }
}
