import type { NearInformation } from '../near-information';
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
}