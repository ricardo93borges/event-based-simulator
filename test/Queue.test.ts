import Random from '../src/Random';
import Scheduler, { EventType } from '../src/Scheduler';
import Queue from '../src/Queue';

describe('Queue class test', () => {
  let queue: Queue;
  let random: Random;
  let scheduler: Scheduler;

  beforeEach(() => {
    random = new Random(12312431, 17, 2147483648, 7);
    scheduler = new Scheduler();
    scheduler.events.push({ type: EventType.ARRIVAL, time: 2 });

    queue = new Queue({
      random,
      scheduler,
      arrivalIntervalStart: 1,
      arrivalIntervalEnd: 2,
      departureIntervalStart: 3,
      departureIntervalEnd: 6,
      servers: 1,
      capacity: 3,
      totalIterations: 10,
    });
  });

  it('Should count time', () => {
    const nextEvent = scheduler.getNext();
    queue.countTime(nextEvent.time);
    expect(queue.globalTime).toEqual(nextEvent.time);
    expect(queue.state[0]).toEqual(nextEvent.time);
  });

  it('Should count accumulated time', () => {
    scheduler.events.push({ type: EventType.ARRIVAL, time: 3 });
    queue.countTime(scheduler.getNext().time);

    queue.length++;
    queue.countTime(scheduler.getNext().time);

    expect(queue.globalTime).toEqual(3);
    expect(queue.state[0]).toEqual(2);
    expect(queue.state[1]).toEqual(1);
  });

  it('Should execute', () => {
    queue.execute();
    expect(queue.globalTime).toBeCloseTo(13.2273, 1);
    expect(queue.length).toEqual(3);
    expect(queue.loss).toEqual(3);
    expect(queue.state[0]).toBeCloseTo(2, 1);
    expect(queue.state[1]).toBeCloseTo(1.9, 1);
    expect(queue.state[2]).toBeCloseTo(3.12, 1);
    expect(queue.state[3]).toBeCloseTo(6.19, 1);
  });

});