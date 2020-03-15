import Queue from './Queue';

const run = (): void => {
  const queue = new Queue(1, 2, 3, 6, 2, 3, 9);
  queue.execute();
};

run();
