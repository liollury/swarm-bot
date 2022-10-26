import Matter from 'matter-js';
import type { NearInformation } from '../near-information';
import { Robot } from './robot';
import { Vector } from '../vector';

export class DrawerRobot extends Robot {
  lastDirection = null;
  targetShapePosition: Vector;
  vectorToTarget: Vector;

  constructor(
    x: number,
    y: number,
    public radius: number,
    public speed: number,
    public detectionRadius: number,
    public shape: number[][]
  ) {
    super(x, y, radius, speed, detectionRadius);
  }

  public tick() {
    /*if (this.data.placed) {
      return;
    }*/
    const nearRobots = this.getNearRobots();
    let nearRobotPlaced;
    if (this.data.placed) {
      nearRobotPlaced = nearRobots.find((info: NearInformation) => info.data.placed && this.isPositionEqual(this.getNextPosition(info.data.shapePosition), this.targetShapePosition))
    } else {
      nearRobotPlaced = nearRobots.filter((info: NearInformation) => info.data.placed)
        .reduce((prev: NearInformation, curr: NearInformation) => {
          if (!prev || this.isPositionAfter(curr.data.shapePosition, prev.data.shapePosition)) {
            return curr;
          }
          return prev;
        }, null);
    }

    let nearRobotSameTarget;
    if (this.targetShapePosition) {
      nearRobotSameTarget = nearRobots.filter((info: NearInformation) => info.data.targetPosition)
        .find((info: NearInformation) => this.isPositionEqual(this.targetShapePosition, info.data.targetPosition))
    }

    const nearRobotFoundTarget = nearRobots.filter((info: NearInformation) => info.data.targetPosition)
      .reduce((prev: NearInformation, curr: NearInformation) => {
        if (!prev || this.isPositionAfter(curr.data.targetPosition, prev.data.targetPosition)) {
          return curr;
        }
        return prev;
      }, null);


    if (nearRobotPlaced || this.vectorToTarget) {
      // If robot is near, we check its position isn't better than mine
      if (nearRobotPlaced) {
        if (!this.data?.placed && (!this.targetShapePosition ||
          (nearRobotSameTarget && (this.id > nearRobotSameTarget.objectId || nearRobotSameTarget.data.placed)) ||
          this.isPositionEqual(nearRobotPlaced.data.shapePosition, this.targetShapePosition))) {
          this.targetShapePosition = this.getNextPosition(nearRobotFoundTarget.data.targetPosition) || Vector.nullVector();
        }

        this.vectorToTarget = this.getVector(nearRobotPlaced.directionAngle, nearRobotPlaced.distance)
          .add(this.targetShapePosition.subtract(nearRobotPlaced.data.shapePosition).multiply(new Vector(25, 25)));

        this.debugVector = this.vectorToTarget;
      }
      const distance = Math.sqrt(Math.pow(this.vectorToTarget.x, 2) + Math.pow(this.vectorToTarget.y, 2));
      if (distance > 0.1) {
        this.vectorToTarget = this.moveToVector(this.vectorToTarget, distance);
        if (!this.data?.placed) {
          this.setData({
            targetPosition: this.targetShapePosition,
          });
        }
        console.log(this.id,
          'target', this.targetShapePosition,
          'placed', nearRobotPlaced?.objectId, nearRobotPlaced?.data.shapePosition,
          'near', nearRobotFoundTarget?.objectId, nearRobotFoundTarget?.data.targetPosition,
          'same', nearRobotSameTarget?.objectId, nearRobotSameTarget?.data.targetPosition,
          'to target', this.vectorToTarget,
          'im placed', this.data?.placed);
      } else {
        this.vectorToTarget = Vector.nullVector();
        this.moveToVector(Vector.nullVector());
        this.setData({
          placed: true,
          shapePosition: this.targetShapePosition,
          targetPosition: this.targetShapePosition,
        });
        // Matter.Body.setStatic(this.body, true);
      }
    } else {
      if (!this.velocityVector || (this.velocityVector.x === 0 && this.velocityVector.y === 0)) {
        this.moveToVector(this.getVector(Math.random() * 360));
      }
      this.moveToVector(this.velocityVector);
    }
  }

  isPositionEqual(v1: Vector, v2: Vector) {
    return v1.y === v2.y && v1.x === v2.x;
  }

  isPositionAfter(v1: Vector, v2: Vector) {
    return v1.y > v2.y || (v1.y === v2.y && v1.x > v2.x);
  }

  getNextPosition(vector: Vector): Vector {
    for(let y = vector.y; y < this.shape.length; y++) {
      let baseX = (y === vector.y) ? vector.x: 0;
      for(let x = baseX; x < this.shape[0].length; x ++) {
        if ((x !== vector.x || y !== vector.y) && this.shape[y][x] === 1) {
          return new Vector(x, y);
        }
      }
    }
  }
}