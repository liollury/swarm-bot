import type { NearInformation } from '../near-information';
import { Vector } from '../vector';
import { Robot } from './robot';

export class NearSeekRobot extends Robot {
  lastDirection = null;

  public tick() {
    const nearRobots = this.getNearRobots();
    const nearWall = this.getNearWall();
    const target = nearRobots.find((info: NearInformation) => info.objectId === 0);
    const nearRobotFoundTarget = nearRobots.sort((a: NearInformation, b:NearInformation) => a.data.distance > b.data.distance ? 1: -1)
      .find((info: NearInformation) => info.data.founded);
    if (target) {
      this.setData({
        founded: true,
        directionAngle: target.directionAngle,
        distance: target.distance
      });
      if (target.distance > this.detectionRadius - 20) {
        this.moveToVector(this.getVector(target.directionAngle, target.distance));
      } else {
        this.moveToVector(new Vector(0, 0));
      }
    } else if (nearRobotFoundTarget) {
      this.setData({
        founded: true,
        directionAngle: nearRobotFoundTarget.directionAngle,
        distance: nearRobotFoundTarget.distance + nearRobotFoundTarget.data.distance
      });
      this.moveToVector(this.getVector(nearRobotFoundTarget.directionAngle, nearRobotFoundTarget.distance));
    } else {
      if (!this.velocityVector || (this.velocityVector.x === 0 && this.velocityVector.y === 0)) {
        this.moveToVector(this.getVector(Math.random() * 360));
      }
      this.moveToVector(this.velocityVector);
    }
  }
}