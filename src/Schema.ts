import fs from 'fs';
import Queue from './Queue';
import Scheduler, { EventType } from './Scheduler';

export interface Arrival {
  queue: number;
  time: number;
}

export interface Transition {
  source: number;
  target: number | string;
  probability: number;
}

export interface SchemaQueue {
  id: number;
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
}

export default class Schema {
  arrivals: Arrival[];
  transitions: Transition[];
  queues: SchemaQueue[];

  constructor() {
    this.arrivals = [];
    this.transitions = [];
    this.queues = [];
  }

  readFile(): Schema {
    const rawData = fs.readFileSync(`${__dirname}/../schema.json`);
    // @ts-ignore
    return JSON.parse(rawData);
  }

  setup(): [Queue[], Scheduler] {
    const json = this.readFile();
    const queues = json.queues.map((queue: SchemaQueue) => {
      return new Queue({
        id: queue.id,
        arrivalIntervalStart: queue.arrivalIntervalStart,
        arrivalIntervalEnd: queue.arrivalIntervalEnd,
        departureIntervalStart: queue.departureIntervalStart,
        departureIntervalEnd: queue.departureIntervalEnd,
        servers: queue.servers,
        capacity: queue.capacity === null ? Infinity : queue.capacity,
      });
    });

    json.transitions.map((transition: Transition) => {
      const sourceIndex = queues.findIndex((q: Queue) => q.id === transition.source);

      let target;
      if (transition.target === 'DEPARTURE') {
        target = EventType.DEPARTURE;
      } else {
        const queueIndex = queues.findIndex((q: Queue) => q.id === transition.target);
        target = queues[queueIndex];
      }

      queues[sourceIndex].targets.push({
        target,
        probability: transition.probability,
      });
    });

    const scheduler = new Scheduler();
    scheduler.events = json.arrivals.map(arrival => ({
      type: EventType.ARRIVAL,
      time: arrival.time,
      queue: queues.find(q => q.id = arrival.queue) as Queue,
    }));

    return [queues, scheduler];
  }
}
