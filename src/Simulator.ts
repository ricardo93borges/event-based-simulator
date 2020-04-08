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

  printResults(queue: Queue): void {
    console.log('queue state | time | probability');
    for (let i = 0; i < queue.state.length; i++) {
      const percent = (queue.state[i] / queue.globalTime) * 100;
      console.log(`${i} | ${queue.state[i].toFixed(4)} | ${percent.toFixed(4)}%`);
    }
    console.log(`total | ${queue.globalTime.toFixed(4)} | 100% `);
    console.log('loss', queue.loss);
    console.log('global time', queue.globalTime);
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
    this.printResults(queue);
    process.exit(0);
  }
}
