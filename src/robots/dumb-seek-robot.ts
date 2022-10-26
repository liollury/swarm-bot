import type { NearInformation } from '../near-information';
import { Vector } from '../vector';
import { Robot } from './robot';

export class DumbSeekRobot extends Robot {
  lastDirection = null;

  public tick() {
    const nearRobots = this.getNearRobots();
    const nearWall = this.getNearWall();
    const target = nearRobots.find((info: NearInformation) => info.objectId === 0);
    if (target) {
      this.setData({
        founded: true,
        directionAngle: target.directionAngle
      });
      if (target.distance > this.detectionRadius - 20) {
        this.moveToVector(this.getVector(target.directionAngle, target.distance));
      } else {
        this.moveToVector(new Vector(0, 0));
      }
    } else {
      if (!this.velocityVector || (this.velocityVector.x === 0 && this.velocityVector.y === 0)) {
        this.moveToVector(this.getVector(Math.random() * 360));
      }
      this.moveToVector(this.velocityVector);
    }
  }
}