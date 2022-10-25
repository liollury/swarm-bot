import type { NearInformation } from '../near-information';
import { Robot } from './robot';
import { Vector } from '../vector';

export class DrawerRobot extends Robot {
  lastDirection = null;
  targetShapePosition: Vector;
  vectorToTarget: Vector;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public speed: number,
    public detectionRadius: number,
    public shape: number[][]
  ) {
    super(x, y, radius, speed, detectionRadius);
  }

  public tick() {
    if (this.data.placed) {
      return;
    }
    const nearRobots = this.getNearRobots();
    const nearWall = this.getNearWall();
    const nearRobotFoundTarget = nearRobots.filter((info: NearInformation) => info.data.placed)
      .reduce((prev: NearInformation, curr: NearInformation) => {
        if (!prev || this.isPositionAfter(curr.data.shapePosition, prev.data.shapePosition)) {
          return curr;
        }
        return prev;
      }, null);
    if (nearRobotFoundTarget || this.vectorToTarget) {
      // If robot is near, we check its position isn't better than mine
      if (nearRobotFoundTarget) {
        if (!this.targetShapePosition ||
          this.isPositionEqual(nearRobotFoundTarget.data.shapePosition, this.targetShapePosition) ||
          this.isPositionAfter(nearRobotFoundTarget.data.shapePosition, this.targetShapePosition)) {
          const [ nextX, nextY ] = this.getNextPosition(nearRobotFoundTarget.data.shapePosition.x, nearRobotFoundTarget.data.shapePosition.y) || [ 0, 0 ];
          this.targetShapePosition = new Vector(nextX, nextY);
        }
        const deltaX = (this.targetShapePosition.x - nearRobotFoundTarget.data.shapePosition.x) * 20;
        const deltaY = (this.targetShapePosition.y - nearRobotFoundTarget.data.shapePosition.y) * 20;
        const vectorToNearRobot = this.getVector(nearRobotFoundTarget.directionAngle, nearRobotFoundTarget.distance);
        const vectorFromNearRobotToTarget = new Vector(deltaX, deltaY);
        this.vectorToTarget = vectorToNearRobot.add(vectorFromNearRobotToTarget);
        this.debugVector = this.vectorToTarget;
      }
      const distance = Math.sqrt(Math.pow(this.vectorToTarget.x, 2) + Math.pow(this.vectorToTarget.y, 2));
      if (distance > 0.1) {
        this.vectorToTarget = this.moveToVector(this.vectorToTarget, distance);
      } else {
        this.setData({
          placed: true,
          shapePosition: new Vector(this.targetShapePosition.x, this.targetShapePosition.y),
        });
      }
    } else {
      if (!this.lastDirection) {
        this.lastDirection = Math.random() * 360;
      } else if (nearWall.length > 0) {
        this.lastDirection = nearWall[0].directionAngle - 180 + (90 * Math.random());
      }
      this.moveToVector(this.getVector(this.lastDirection));
    }
  }

  isPositionEqual(v1: Vector, v2: Vector) {
    return v1.y === v2.y && v1.x === v2.x;
  }

  isPositionAfter(v1: Vector, v2: Vector) {
    return v1.y > v2.y || (v1.y === v2.y && v1.x > v2.x);
  }

  getNextPosition(currentFilledX: number, currentFilledY: number): number[] {
    for(let y = currentFilledY; y < this.shape.length; y++) {
      let baseX = (y === currentFilledY) ? currentFilledX: 0;
      for(let x = baseX; x < this.shape[0].length; x ++) {
        if ((x !== currentFilledX || y !== currentFilledY) && this.shape[y][x] === 1) {
          return [x, y];
        }
      }
    }
  }
}