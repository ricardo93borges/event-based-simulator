import Simulator from './Simulator';

const run = (): void => {
  const simulator = new Simulator(100000);
  simulator.run();
};

run();
