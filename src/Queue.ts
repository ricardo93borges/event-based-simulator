export interface QueueParams {
  id: number;
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
}
export default class Queue {
  id: number;
  arrivalIntervalStart: number;
  arrivalIntervalEnd: number;
  departureIntervalStart: number;
  departureIntervalEnd: number;
  servers: number;
  capacity: number;
  state: number[];
  length: number;
  globalTime: number;
  loss: number;
  target?: Queue;

  constructor(params: QueueParams) {
    this.id = params.id;
    this.arrivalIntervalStart = params.arrivalIntervalStart;
    this.arrivalIntervalEnd = params.arrivalIntervalEnd;
    this.departureIntervalStart = params.departureIntervalStart;
    this.departureIntervalEnd = params.departureIntervalEnd;
    this.servers = params.servers;
    this.capacity = params.capacity;
    this.state = [];
    this.length = 0;
    this.globalTime = 0;
    this.loss = 0;
  }
}
