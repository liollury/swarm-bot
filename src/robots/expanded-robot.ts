import type { NearInformation } from '../near-information';
import { Vector } from '../vector';
import { Robot } from './robot';

export class ExpandedRobot extends Robot {
  lastDirection = null;

  public tick() {
    const nearRobots = this.getNearRobots();
    const nearWall = this.getNearWall();
    if (nearRobots.length > 0) {
      const nearestRobot = nearRobots.reduce((previous: NearInformation, current: NearInformation) => current.distance < (previous?.distance || Number.POSITIVE_INFINITY) ? current : previous, null);
      if (nearestRobot.distance < this.detectionRadius - 1) {
        const oppositeAngle = nearestRobot.directionAngle - 180;
        this.moveToVector(this.getVector(oppositeAngle));
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