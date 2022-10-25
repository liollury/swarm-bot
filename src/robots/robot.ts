import type { NearInformation } from '../near-information';
import { Vector } from '../vector';
import type { World } from '../world';

export class Robot {
  debug = false;
  world: World;
  id: number;
  color = '#ee2222';
  data: any = {};
  debugVector: Vector;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public speed: number,
    public detectionRadius: number
  ) {}

  public tick() {
    throw new Error('Not implemented !');
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    if (this.debug) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.detectionRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.textAlign = 'center';
      ctx.fillText(`${this.id}`, this.x, this.y + this.radius  / 4);
      if (this.debugVector) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.debugVector.x, this.y + this.debugVector.y);
        ctx.strokeStyle = "#aaa";
        ctx.stroke();
      }
    }
  }

  getNearRobots(): NearInformation[] {
    return this.world.getNearRobots(this);
  }

  getNearWall(): NearInformation[] {
    return this.world.getNearWall(this);
  }

  getVector(angle: number, distance: number = this.speed): Vector {
    const radian = angle * Math.PI / 180;
    let deltax = Math.cos(radian) * distance;
    let deltay = Math.tan(radian) * deltax;
    return new Vector(deltax, deltay);
  }

  /**
   * Move by the vector description with maximum movement length (minimum between robot speed and maxDistance)
   * @param vector movement vector
   * @param maxDistance maximum distance
   * @return a new vector with corrected relative vector (original vector - traveled distance)
   */
  moveToVector(vector: Vector, maxDistance: number = Number.POSITIVE_INFINITY): Vector {
    let adjustedVector = vector;
    const distance = Math.min(this.speed, maxDistance);
    if (vector.size > distance) {
      adjustedVector = vector.scale(this.speed / vector.size);
    }
    [this.x, this.y] = [this.x + adjustedVector.x, this.y + adjustedVector.y];
    return vector.subtract(adjustedVector);
  }

  clone(): Robot {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  setData(data: any) {
    this.data = data;
  }
}