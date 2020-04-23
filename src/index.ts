import Simulator from './Simulator';
import Schema from './Schema';

const run = (): void => {
  const schema = new Schema();
  const queues = schema.setupQueues();
  const simulator = new Simulator(100000, queues);
  simulator.run();
};

run();
