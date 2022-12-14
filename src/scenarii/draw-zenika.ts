import { Vector } from '../vector';
import { DrawSimulation } from './draw';

export class DrawZenikaSimulation extends DrawSimulation {
  shape: number[][] = [
    [1, 1, 1, 1, 1, 1, 1,  0, 1, 1, 1, 1, 1, 0,  1, 0, 0, 0, 0, 0, 1,  0, 1, 1, 1, 1, 1, 0,  1, 0, 0, 0, 1, 0,  0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0,  0, 1, 0, 0, 0, 0, 0,  1, 1, 0, 0, 0, 0, 1,  0, 0, 0, 1, 0, 0, 0,  1, 0, 0, 1, 0, 0,  0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0,  0, 1, 0, 0, 0, 0, 0,  1, 0, 1, 0, 0, 0, 1,  0, 0, 0, 1, 0, 0, 0,  1, 0, 1, 0, 0, 0,  0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0,  0, 1, 1, 1, 0, 0, 0,  1, 0, 0, 1, 0, 0, 1,  0, 0, 0, 1, 0, 0, 0,  1, 1, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0,  0, 1, 0, 0, 0, 0, 0,  1, 0, 0, 0, 1, 0, 1,  0, 0, 0, 1, 0, 0, 0,  1, 0, 1, 0, 0, 0,  0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0,  0, 1, 0, 0, 0, 0, 0,  1, 0, 0, 0, 0, 1, 1,  0, 0, 0, 1, 0, 0, 0,  1, 0, 0, 1, 0, 0,  0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1,  0, 1, 1, 1, 1, 1, 0,  1, 0, 0, 0, 0, 0, 1,  0, 1, 1, 1, 1, 1, 0,  1, 0, 0, 0, 1, 0,  1, 0, 0, 0, 0, 0, 1]
  ];

  startPosition: Vector = new Vector(100, 300);
}