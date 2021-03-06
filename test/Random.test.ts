import Random from '../src/Random';

describe('Random class tests', () => {
  let random;

  beforeEach(() => {
    random = new Random(4, 4, 9, 7);
  });

  it('should return x1 close to 0.5555', () => {
    const x1 = random.generate();
    expect(x1).toBeCloseTo(0.5555, 1);
  });

  it('should return x2 close to 0.6666', () => {
    random.generate();
    const x2 = random.generate();
    expect(x2).toBeCloseTo(0.6666, 1);
  });

  it('should return x2 close to 0.1111', () => {
    random.generate();
    random.generate();
    const x3 = random.generate();
    expect(x3).toBeCloseTo(0.1111, 1);
  });
});