/**
 * Uses Linear Congruence Method to generate random numbers
 */
export default class Random {

  a: number;
  c: number;
  m: number;
  x: number;

  constructor(a: number, c: number, m: number, x: number) {
    this.a = a;
    this.c = c;
    this.m = m;
    this.x = x;
  }

  generate(): number {
    this.x = (this.a * this.x + this.c) % this.m;
    return this.x / this.m;
  }
}
