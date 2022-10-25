import type { NearInformation } from '../near-information';
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