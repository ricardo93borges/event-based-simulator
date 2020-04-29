import Queue, { Transition } from './Queue';
import Random from './Random';
import Scheduler, { EventType } from './Scheduler';

export default class Simulator {
  random: Random;
  totalIterations: number;
  scheduler: Scheduler;
  globalTime: number;
  queues: Queue[];
  transitionsDeparture = 0;
  transitionsEvent = 0;

  constructor(totalIterations: number, queues: Queue[], scheduler: Scheduler, random: Random) {
    this.queues = queues;
    this.random = random;
    this.totalIterations = totalIterations;
    this.globalTime = 0;
    this.scheduler = scheduler;
  }

  printResults(): void {
    this.queues.forEach(queue => {
      console.log(`Queue: ${queue.id} | G/G/${queue.servers}/${queue.capacity} | Arrival ${queue.arrivalIntervalStart}..${queue.arrivalIntervalEnd} | Service ${queue.departureIntervalStart}..${queue.departureIntervalEnd} `);
      console.log('state | time | probability');

      let max = queue.state.length;
      if (queue.capacity === Infinity && queue.state.length > 10) {
        max = 10;
      }

      for (let i = 0; i < max; i++) {
        const percent = (queue.state[i] / this.globalTime) * 100;
        console.log(`${i} | ${queue.state[i].toFixed(4)} | ${percent.toFixed(4)}`);
      }

      if (queue.capacity === Infinity) {
        console.log(`... more ${queue.state.length - max}`);
      }

      console.log(`\ntotal | ${this.globalTime.toFixed(4)} | 100% `);
      console.log('losses', queue.loss);
      console.log('\n -------- \n');
    });
    console.log('global time', this.globalTime);

    let a = 0;
    let d = 0;
    let t = 0;

    this.scheduler.history.forEach(e => {
      if (e.type === EventType.ARRIVAL)
        a++;
      if (e.type === EventType.DEPARTURE)
        d++;
      if (e.type === EventType.TRANSITION)
        t++;
    });

    console.log('\nevents', this.scheduler.history.length);
    console.log('arrivals', a);
    console.log('departures', d);
    console.log('transitions', t);
    console.log('\ntransitionsDeparture', this.transitionsDeparture);
    console.log('transitionsEvent', this.transitionsEvent);
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
    const target = this.chooseTarget(queue.targets);
    if (target === EventType.DEPARTURE) {
      this.scheduleDeparture(queue);
      this.transitionsDeparture++;
    } else if (target instanceof Queue) {
      this.scheduler.schedule({
        queue,
        target,
        start: queue.departureIntervalStart,
        end: queue.departureIntervalEnd,
        random: this.random.generate(),
        type: EventType.TRANSITION,
        globalTime: this.globalTime,
      });
      this.transitionsEvent++;
    }
  }

  chooseTarget(transitions: Transition[]): Queue | EventType {
    const random = Math.random();
    const sortedTransitions = transitions.sort((a, b) => a.probability > b.probability ? -1 : 1);

    let transition = null;
    if (random < sortedTransitions[0].probability) {
      transition = sortedTransitions[0];
    }
    for (let i = 1; i < sortedTransitions.length; i++) {
      if (random > (1 - sortedTransitions[i].probability)) {
        transition = sortedTransitions[i];
      }
    }

    if (!transition) {
      transition = sortedTransitions[sortedTransitions.length - 1];
    }

    if (!transition) {
      console.log(sortedTransitions);
      console.log(random);
      throw new Error('No target for transition');
    }

    if (transitions.length === 3) {
      console.log(sortedTransitions.map(t => t.probability));
      console.log(random);
      console.log(transition.probability);
      console.log('-------');
    }

    return transition.target;
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
            if (queue.targets.length > 0) {
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
          if (queue.targets.length > 0) {
            this.scheduleTransition(queue);
          } else {
            this.scheduleDeparture(queue);
          }
        }
      } else if (nextEvent.type === EventType.TRANSITION) {
        if (!nextEvent.target) {
          throw new Error('Next event does not have a target');
        }

        this.countTime(nextEvent.time);
        queue.length--;

        if (queue.length >= queue.servers) {
          this.scheduleTransition(queue);
        }

        if (nextEvent.target.length < nextEvent.target.capacity) {
          nextEvent.target.length++;
          if (nextEvent.target.length <= nextEvent.target.servers) {
            this.scheduleDeparture(nextEvent.target);
          }
        } else {
          nextEvent.target.loss++;
        }
      }
    }

    this.printResults();
  }
}
