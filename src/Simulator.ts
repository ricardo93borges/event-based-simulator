import Queue from './Queue';
import Random from './Random';
import Scheduler, { EventType } from './Scheduler';

// TODO handle queues with multiple targets
// TODO handle queue infinity capacity
// TODO queues with routing probability

export default class Simulator {
  random: Random;
  totalIterations: number;
  scheduler: Scheduler;
  globalTime: number;
  queues: Queue[];

  constructor(totalIterations: number, queues: Queue[]) {
    this.queues = queues;
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
    scheduler.events.push({
      type: EventType.ARRIVAL,
      time: 2,
      queue: this.queues[0]
    });
    return scheduler;
  }

  printResults(): void {
    this.queues.forEach(queue => {
      console.log(`Queue: ${queue.id} | G/G/${queue.servers}/${queue.capacity} | Arrival ${queue.arrivalIntervalStart}..${queue.arrivalIntervalEnd} | Service ${queue.departureIntervalStart}..${queue.departureIntervalEnd} `);
      console.log('state | time | probability');
      for (let i = 0; i < queue.state.length; i++) {
        const percent = (queue.state[i] / this.globalTime) * 100;
        console.log(`${i} | ${queue.state[i].toFixed(4)} | ${percent.toFixed(4)}%`);
      }
      console.log(`total | ${this.globalTime.toFixed(4)} | 100% `);
      console.log('losses', queue.loss);
      console.log(' -------- ');
    });
    console.log('global time', this.globalTime);
  }

  countTime(time: number): void {
    const delta = time - this.globalTime;
    this.queues.forEach(queue => {
      const accumulatedTime = queue.state[queue.length] ? queue.state[queue.length] : 0;
      queue.state[queue.length] = accumulatedTime + delta;
    });
    this.globalTime = this.globalTime + delta;
  }

  scheduleArrival(queue: Queue): void {
    this.scheduler.schedule({
      queue,
      start: queue.arrivalIntervalStart,
      end: queue.arrivalIntervalEnd,
      random: this.random.generate(),
      type: EventType.ARRIVAL,
      globalTime: this.globalTime
    });
  }

  scheduleDeparture(queue: Queue): void {
    this.scheduler.schedule({
      queue,
      start: queue.departureIntervalStart,
      end: queue.departureIntervalEnd,
      random: this.random.generate(),
      type: EventType.DEPARTURE,
      globalTime: this.globalTime
    });
  }

  scheduleTransition(queue: Queue): void {
    this.scheduler.schedule({
      queue,
      start: queue.departureIntervalStart,
      end: queue.departureIntervalEnd,
      random: this.random.generate(),
      type: EventType.TRANSITION,
      globalTime: this.globalTime,
      target: queue.target,
    });
  }

  run(): void {
    for (let i = 0; i < this.totalIterations; i++) {

      const nextEvent = this.scheduler.getNext();

      if (!nextEvent) {
        console.log('There is no new event');
        return;
      }

      const queue = nextEvent.queue;

      if (nextEvent.type === EventType.ARRIVAL) {
        this.countTime(nextEvent.time);

        if (queue.length < queue.capacity) {
          queue.length++;
          if (queue.length <= queue.servers) {
            if (queue.target) {
              this.scheduleTransition(queue);
            } else {
              this.scheduleDeparture(queue);
            }
          }
        } else {
          queue.loss++;
        }
        this.scheduleArrival(queue);
      } else if (nextEvent.type === EventType.DEPARTURE) {
        this.countTime(nextEvent.time);
        queue.length--;

        if (queue.length >= queue.servers) {
          this.scheduleDeparture(queue);
        }
      } else if (nextEvent.type === EventType.TRANSITION) {
        if (!queue.target) {
          throw new Error('Queue does not have a target');
        }

        this.countTime(nextEvent.time);
        queue.length--;

        if (queue.length >= queue.servers) {
          this.scheduleTransition(queue);
        }

        if (queue.target.length < queue.target.capacity) {
          queue.target.length++;
          if (queue.target.length <= queue.target.servers) {
            this.scheduleDeparture(queue.target);
          }
        } else {
          queue.target.loss++;
        }
      }
    }

    this.printResults();
  }
}
