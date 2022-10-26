import { Vector } from '../vector';
import { Robot } from './robot';

export class StaticRobot extends Robot {

  constructor(x: number, y: number, radius: number, speed: number, detectionRadius: number) {
    super(x, y, radius, speed, detectionRadius, {
      isStatic: true,
      render: { fillStyle: 'rgb(6 62 123)' }
    });
  }

  public tick(): Vector {
    return new Vector(0, 0);
  }
}