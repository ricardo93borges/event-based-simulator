import Random from '../src/Random';
import Scheduler, { EventType } from '../src/Scheduler';
import Simulator from '../src/Simulator';

describe('Simulator class test', () => {
  let simulator: Simulator;
  let random: Random;

  beforeEach(() => {
    random = new Random(12312431, 17, 2147483648, 7);
    const queues = [{
      id: 1,
      arrivalIntervalStart: 1,
      arrivalIntervalEnd: 2,
      departureIntervalStart: 3,
      departureIntervalEnd: 6,
      servers: 1,
      capacity: 3,
      state: [],
      length: 0,
      globalTime: 0,
      loss: 0,
      targets: [],
    }];

    const scheduler = new Scheduler();
    scheduler.events.push({
      type: EventType.ARRIVAL,
      time: 2,
      queue: queues[0]
    });

    simulator = new Simulator(10, queues, scheduler, random);
  });

  it('Should count time', () => {
    const nextEvent = simulator.scheduler.getNext();
    simulator.countTime(nextEvent.time);
    expect(simulator.globalTime).toEqual(nextEvent.time);
    expect(simulator.queues[0].state[0]).toEqual(nextEvent.time);
  });

  it('Should count accumulated time', () => {
    simulator.scheduler.events.push({
      type: EventType.ARRIVAL,
      time: 3,
      queue: simulator.queues[0]
    });
    simulator.countTime(simulator.scheduler.getNext().time);

    simulator.queues[0].length++;
    simulator.countTime(simulator.scheduler.getNext().time);

    expect(simulator.globalTime).toEqual(3);
    expect(simulator.queues[0].state[0]).toEqual(2);
    expect(simulator.queues[0].state[1]).toEqual(1);
  });

  it.only('Should execute', () => {
    simulator.run();

    expect(simulator.globalTime).toBeCloseTo(13.2273, 1);
    expect(simulator.queues[0].length).toEqual(3);
    expect(simulator.queues[0].loss).toEqual(3);
    expect(simulator.queues[0].state[0]).toBeCloseTo(2, 1);
    expect(simulator.queues[0].state[1]).toBeCloseTo(1.9, 1);
    expect(simulator.queues[0].state[2]).toBeCloseTo(3.12, 1);
    expect(simulator.queues[0].state[3]).toBeCloseTo(6.19, 1);
  });

});