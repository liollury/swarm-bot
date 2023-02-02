import Matter from 'matter-js';
import type { NearInformation } from '../near-information';
import { Robot } from './robot';
import { Vector } from '../vector';

export class DrawerRobot extends Robot {
  lastDirection = null;
  targetShapePosition: Vector;
  vectorToTarget: Vector;
  antiCollisionVector: Vector;
  placedRobotShape: boolean[][];
  lastCollisionTicks: number[];

  constructor(
    x: number,
    y: number,
    public radius: number,
    public speed: number,
    public detectionRadius: number,
    public shape: number[][]
  ) {
    super(x, y, radius, speed, detectionRadius);
    // create similar grid than shape with boolean to know where are robots placed
    this.placedRobotShape = [ ...Array(shape.length) ].map(() => [ ...Array(shape[0].length) ].map(() => false));
    this.lastCollisionTicks = [];
  }

  public tick(tickNumber: number) {
    if (this.simulationComplete()) {
      return;
    }
    // get detectable robots
    const nearRobots = this.getNearRobots();
    let nearRobotPlaced;
    nearRobots.forEach((info: NearInformation) => {
      if (info.data.objectId === 0) {
        this.placedRobotShape[info.data.shapePosition.y][info.data.shapePosition.x] = true;
      }
      if (info.data.placedRobotShape) {
        this.mergePlacedRobotShape(info.data.placedRobotShape);
      }
    });

    if (this.data.placed) {
      nearRobotPlaced = nearRobots.find((info: NearInformation) => info.data.placed && this.isPositionEqual(this.getNextPosition(info.data.shapePosition), this.targetShapePosition));
    } else {
      nearRobotPlaced = nearRobots.filter((info: NearInformation) => info.data.placed)
        .reduce((prev: NearInformation, curr: NearInformation) => {
          if (!prev || this.isPositionAfter(curr.data.shapePosition, prev.data.shapePosition)) {
            return curr;
          }
          return prev;
        }, null);
    }

    const nearestRobot = nearRobots.reduce((prev: NearInformation, curr: NearInformation) => {
      if (prev.distance > curr.distance) {
        return curr;
      }
      return prev;
    }, { distance: Number.POSITIVE_INFINITY } as NearInformation);

    if (nearestRobot.distance - (this.radius * 2) < this.speed && !this.data?.placed) {
      this.lastCollisionTicks.push(tickNumber);
      const tickInShortPast: number = this.lastCollisionTicks.filter((tick: number) => tick > tickNumber - 500).length;
      this.antiCollisionVector = this.getVector(nearestRobot.directionAngle - 180, (Math.random() * this.detectionRadius * (1 + tickInShortPast / 10)));
      this.vectorToTarget = null;
      this.targetShapePosition = null;
      this.setData({});
    }

    if (this.antiCollisionVector) {
      this.antiCollisionVector = this.antiCollisionVector.subtract(this.moveToVector(this.antiCollisionVector));
      if (this.antiCollisionVector.size < this.speed) {
        this.antiCollisionVector = null;
      }
    } else if (nearRobotPlaced || this.vectorToTarget) {
      if (!this.data?.placed && nearRobotPlaced) {
        this.targetShapePosition = this.getNextAvailablePosition();
        this.vectorToTarget = this.getVector(nearRobotPlaced.directionAngle, nearRobotPlaced.distance)
          .add(this.targetShapePosition.subtract(nearRobotPlaced.data.shapePosition).multiply(new Vector(25, 25)));

      }
      const distance = Math.sqrt(Math.pow(this.vectorToTarget.x, 2) + Math.pow(this.vectorToTarget.y, 2));
      if (distance > 0.1) {
        this.vectorToTarget = this.vectorToTarget.subtract(this.moveToVector(this.vectorToTarget, distance));
        if (!this.data?.placed) {
          this.setData({
            targetPosition: this.targetShapePosition
          });
        }
        /*console.log(this.id,
          'target', this.targetShapePosition,
          'placed', nearRobotPlaced?.objectId, nearRobotPlaced?.data.shapePosition,
          'near', nearRobotFoundTarget?.objectId, nearRobotFoundTarget?.data.targetPosition,
          'same', nearRobotSameTarget?.objectId, nearRobotSameTarget?.data.targetPosition,
          'to target', this.vectorToTarget,
          'im placed', this.data?.placed);*/
      } else {
        this.vectorToTarget = Vector.nullVector();
        this.moveToVector(Vector.nullVector());
        this.placedRobotShape[this.targetShapePosition.y][this.targetShapePosition.x] = true;
        this.setData({
          placed: true,
          shapePosition: this.targetShapePosition,
          targetPosition: this.targetShapePosition
        });
      }
    } else {
      if (!this.velocityVector || (this.velocityVector.x === 0 && this.velocityVector.y === 0)) {
        this.moveToVector(this.getVector(Math.random() * 360));
      }
      this.moveToVector(this.velocityVector);
    }

    this.mergeData({
      placedRobotShape: this.placedRobotShape
    });
  }

  isPositionEqual(v1: Vector, v2: Vector) {
    return v1.y === v2.y && v1.x === v2.x;
  }

  isPositionAfter(v1: Vector, v2: Vector) {
    return v1.y > v2.y || (v1.y === v2.y && v1.x > v2.x);
  }

  getNextPosition(vector: Vector): Vector {
    for (let y = vector.y; y < this.shape.length; y++) {
      let baseX = (y === vector.y) ? vector.x : 0;
      for (let x = baseX; x < this.shape[0].length; x++) {
        if ((x !== vector.x || y !== vector.y) && this.shape[y][x] === 1) {
          return new Vector(x, y);
        }
      }
    }
  }

  getNextAvailablePosition() {
    for (let y = 0; y < this.placedRobotShape.length; y++) {
      for (let x = 0; x < this.placedRobotShape[0].length; x++) {
        if (!this.placedRobotShape[y][x] && this.shape[y][x] === 1) {
          return new Vector(x, y);
        }
      }
    }
  }

  mergePlacedRobotShape(placeRobotShape: boolean[][]) {
    for (let y = 0; y < this.placedRobotShape.length; y++) {
      for (let x = 0; x < this.placedRobotShape[0].length; x++) {
        this.placedRobotShape[y][x] = this.placedRobotShape[y][x] || placeRobotShape[y][x];
      }
    }
  }

  simulationComplete(): boolean {
    return this.placedRobotShape[this.placedRobotShape.length - 1][this.placedRobotShape[0].length - 1];
  }
}