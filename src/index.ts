import Simulator from './Simulator';
import Schema from './Schema';
import Random from './Random';

const run = (): void => {
  const schema = new Schema();
  const [queues, scheduler] = schema.setup();

  const a = 12312431;
  const c = 17;
  const m = 2147483648;
  const random = new Random(a, c, m, 7);

  const simulator = new Simulator(100000, queues, scheduler, random);
  simulator.run();
};

run();
