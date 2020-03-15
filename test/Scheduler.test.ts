import Random from '../src/Random';
import Scheduler, { EventType } from '../src/Scheduler';

describe('Random class tests', () => {
  let random;
  let scheduler;

  beforeEach(() => {
    random = new Random(4, 4, 9, 7);
    scheduler = new Scheduler();
  });

  it('should calculate event time', () => {
    const randomNumber = random.generate(); // 0.5555
    const eventTime = scheduler.calculateTime(1, 2, randomNumber);
    expect(eventTime).toBeCloseTo(1.5555, 1);
  });

  it('should schedule an arrival event', () => {
    const randomNumber = random.generate(); // 0.5555
    const eventTime = scheduler.calculateTime(1, 2, randomNumber); // 1.5555
    scheduler.schedule(EventType.ARRIVAL, 1, 2, randomNumber);

    expect(scheduler.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: EventType.ARRIVAL,
          time: eventTime
        })
      ])
    );
  });

  it('should schedule an departure event', () => {
    const randomNumber = random.generate(); // 0.5555
    const eventTime = scheduler.calculateTime(3, 6, randomNumber); // 4.6665
    scheduler.schedule(EventType.DEPARTURE, 3, 6, randomNumber);

    expect(scheduler.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: EventType.DEPARTURE,
          time: eventTime
        })
      ])
    );
  });

  it('should return the next event', () => {
    const firstRandomNumber = random.generate(); // 0.5555
    const secondRandomNumber = random.generate();

    scheduler.schedule(EventType.ARRIVAL, 1, 2, firstRandomNumber);
    scheduler.schedule(EventType.DEPARTURE, 3, 6, secondRandomNumber);

    const nextEvent = scheduler.getNext();
    expect(nextEvent.type).toEqual(EventType.ARRIVAL);
  });

});
