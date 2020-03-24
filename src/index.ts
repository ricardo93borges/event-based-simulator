import Queue from './Queue';

const run = (): void => {
  const queue = new Queue(2, 4, 3, 6, 1, 5, 100000);
  queue.execute();
};

run();
