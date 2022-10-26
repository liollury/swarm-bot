import type { NearInformation } from '../near-information';
import { Vector } from '../vector';
import { Robot } from './robot';

export class NearByNearSeekRobot extends Robot {
  lastDirection = null;

  public tick() {
    const nearRobots = this.getNearRobots();
    const nearRobotsWithoutTarget = this.getNearRobots().filter((info: NearInformation) => info.objectId !== 0);
    const nearWalls = this.getNearWall();
    const target = nearRobots.find((info: NearInformation) => info.objectId === 0);
    const nearRobotFoundTarget = nearRobots.sort((a: NearInformation, b:NearInformation) => a.data.distance > b.data.distance ? 1: -1)
      .find((info: NearInformation) => info.data.founded);
    if (target) {
      this.setData({
        founded: true,
        directionAngle: target.directionAngle,
        distance: target.distance,
        neighbours: Array.from(new Set(
          ...[
            nearRobotsWithoutTarget.filter((info: NearInformation) => info.data.neighbours)
              .map((info: NearInformation) => info.data.neighbours).flat()
          ],
          ...nearRobotsWithoutTarget.map((info: NearInformation) => info.objectId)
        ))
      });
      if (target.distance > this.detectionRadius - 20 && this.data.neighbours.length >= 12) {
        this.moveToVector(this.getVector(target.directionAngle, target.distance));
      } else {
        this.moveToVector(new Vector(0, 0));
      }
    } else if (nearRobotFoundTarget) {
      this.setData({
        founded: true,
        directionAngle: nearRobotFoundTarget.directionAngle,
        distance: nearRobotFoundTarget.distance + nearRobotFoundTarget.data.distance,
        neighbours: Array.from(new Set(
          [...nearRobotsWithoutTarget.filter((info: NearInformation) => info.data.neighbours)
            .map((info: NearInformation) => info.data.neighbours).flat(),
          ...nearRobotsWithoutTarget.map((info: NearInformation) => info.objectId)]
        ))
      });
      if (this.data.neighbours.length >= 12 || this.getNearest(nearRobotsWithoutTarget).distance > this.detectionRadius / 1.5) {
        this.moveToVector(this.getVector(nearRobotFoundTarget.directionAngle, nearRobotFoundTarget.distance));
      } else {
        this.moveToVector(new Vector(0, 0));
      }
    } else {
      this.setData({});
      if (!this.velocityVector || (this.velocityVector.x === 0 && this.velocityVector.y === 0)) {
        this.moveToVector(this.getVector(Math.random() * 360));
      }
      this.moveToVector(this.velocityVector);
    }
  }

  getNearest(infos: NearInformation[]): NearInformation {
    return infos?.reduce((previous: NearInformation, current: NearInformation) => current.distance < (previous?.distance || Number.POSITIVE_INFINITY) ? current : previous, null);
  }
}