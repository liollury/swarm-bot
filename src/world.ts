import type { NearInformation } from './near-information';
import type { Robot } from './robots/robot';
import { Vector } from './vector';

export class World {
  speed: number;
  robots: Robot[];
  ctx: CanvasRenderingContext2D;
  timer;
  simulationActive = false;

  constructor(protected width: number, protected height: number) {}



  startSimulation() {
    this.robots.forEach((robot: Robot) => robot.world = this);
    this.timer = setInterval(this.tickSimulation.bind(this), 1000 / this.speed);
    this.simulationActive = true;
  }

  stopSimulation() {
    clearTimeout(this.timer);
    this.simulationActive = false;
  }

  tickSimulation() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.robots.forEach((robot: Robot) => {
      robot.tick();
      requestAnimationFrame(robot.draw.bind(robot, this.ctx));
    });
  }

  generateRobotsGrid(model: Robot, xCount: number, yCount: number, gapHorizontal: number, gapVertical: number) {
    const totalWidth = (xCount - 1) * gapHorizontal + (xCount * model.radius);
    const totalHeight = (yCount - 1) * gapVertical + (yCount * model.radius);
    const startX = (this.width - totalWidth) / 2;
    const startY = (this.height - totalHeight) / 2;
    this.robots = [];
    let id = 1;
    for(let x = startX; x < startX + totalWidth; x += model.radius + gapHorizontal) {
      for(let y = startY; y < startY + totalHeight; y += model.radius + gapVertical) {
        const robot = model.clone();
        robot.x = x;
        robot.y = y;
        robot.id = id++;
        this.robots.push(robot);
      }
    }
  }

  generateRobotsRandom(model: Robot, count: number, squareWidth: number, squareHeight: number) {
    const startSquareX = (this.width - squareWidth) / 2;
    const startSquareY = (this.height - squareHeight) / 2;
    this.robots = [];
    for(let i = 1; i <= count; i++) {
      const robot = model.clone();
      robot.x = startSquareX + Math.random() * squareWidth;
      robot.y = startSquareY + Math.random() * squareHeight;
      robot.id = i;
      this.robots.push(robot);
    }
  }

  getNearestRobotsInDirection(robot: Robot, vector: Vector): NearInformation {
    const candidates = this.getNearRobotsInDirection(robot, vector);
    if (candidates.length > 0) {
      return candidates.reduce((prev: NearInformation, curr: NearInformation) => !prev || prev.distance > curr.distance ? curr : prev, null);
    }
  }

  getNearRobotsInDirection(robot: Robot, vector: Vector): NearInformation[] {
    const robotVector = new Vector(robot.x, robot.y);
    return this.robots.filter((candidate: Robot) => {
      if (candidate === robot) {
        return false;
      }
      const candidateVector = new Vector(candidate.x, candidate.y);
      let x1 = robotVector.subtract(candidateVector);
      let x2 = robotVector.add(vector).subtract(candidateVector);
      let dv = x2.subtract(x1);
      let dr = dv.size;
      let D = x1.x * x2.y - x2.x * x1.y;
      // evaluate if there is an intersection
      let di =  candidate.radius * candidate.radius * dr * dr - D * D;
      if (di < 0.0) {
        return false;
      }
      return true;
    }).map((near: Robot) => ({
      objectId: near.id,
      directionAngle: Math.atan2(near.y - robot.y, near.x - robot.x) * (180 / Math.PI),
      distance: Math.sqrt(Math.pow((near.x - robot.x), 2) + Math.pow((near.y - robot.y), 2) ) - near.radius / 2 - robot.radius / 2,
      data: near.data
    }));
  }

  getNearRobots(robot: Robot): NearInformation[] {
    const nearRobots = this.robots.filter((candidate: Robot) => robot !== candidate && Math.sqrt(Math.pow((candidate.x - robot.x), 2) + Math.pow((candidate.y - robot.y), 2) ) < robot.detectionRadius);
    return nearRobots.map((near: Robot) => ({
      objectId: near.id,
      directionAngle: Math.atan2(near.y - robot.y, near.x - robot.x) * (180 / Math.PI),
      distance: Math.sqrt(Math.pow((near.x - robot.x), 2) + Math.pow((near.y - robot.y), 2) ),
      data: near.data
    }));
  }

  getNearWall(robot: Robot): NearInformation[] {
    const information: NearInformation[] = [];
    if (robot.x - robot.detectionRadius < 0) {
      information.push({
        directionAngle: 180,
        distance: robot.x
      });
    }
    if (robot.x + robot.detectionRadius > this.width) {
      information.push({
        directionAngle: 0,
        distance: this.width - robot.x
      });
    }
    if (robot.y - robot.detectionRadius < 0) {
      information.push({
        directionAngle: 270,
        distance: robot.y
      });
    }
    if (robot.y + robot.detectionRadius > this.height) {
      information.push({
        directionAngle: 90,
        distance: this.height - robot.y
      });
    }
    return information;
  }
}