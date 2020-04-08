import Queue from './Queue';
import Random from './Random';
import Scheduler, { EventType } from './Scheduler';

export default class Simulator {
  random: Random;
  totalIterations: number;
  scheduler: Scheduler;

  constructor(totalIterations: number) {
    this.random = this.setupRandom();
    this.scheduler = this.setupScheduler();
    this.totalIterations = totalIterations;
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

  run(): void {
    const queueParams = {
      arrivalIntervalStart: 1,
      arrivalIntervalEnd: 2,
      departureIntervalStart: 3,
      departureIntervalEnd: 6,
      servers: 1,
      capacity: 3,
      totalIterations: this.totalIterations,
      random: this.random,
      scheduler: this.scheduler,
    };
    const queue = new Queue(queueParams);
    queue.execute();
  }
}
