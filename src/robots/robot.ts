import Matter, { Bodies, Body, IBodyDefinition, Vector as MatterVector } from 'matter-js';
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
  private _body: Body;
  velocityVector: Vector;

  constructor(
    x: number,
    y: number,
    public radius: number,
    public speed: number,
    public detectionRadius: number,
    private options: IBodyDefinition = { render: { fillStyle: 'rgb(245 90 60)' } }
  ) {
    this.x = x;
    this.y = y;
  }

  get body(): Body {
    if (!this._body) {
      this._body = Bodies.circle(0, 0, this.radius, this.options);
      // this._body.friction = 0;
      // this._body.frictionAir = 0;
      this._body.restitution = 0.5;
    }
    return this._body;
  }

  set x(x: number) {
    Matter.Body.setPosition(this.body, MatterVector.create(x, this.body.position.y));
  }

  set y(y: number) {
    Matter.Body.setPosition(this.body, MatterVector.create(this.body.position.x, y));
  }

  get x(): number {
    return this.body.position.x;
  }

  get y(): number {
    return this.body.position.y;
  }

  public tick() {
    throw new Error('Not implemented !');
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
    if (vector.size !== distance) {
      adjustedVector = vector.scale(distance / vector.size);
    }
    this.velocityVector = new Vector(adjustedVector.x, adjustedVector.y);
    return vector.subtract(adjustedVector);
  }

  clone(): Robot {
    const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    clone._body = null;
    return clone;
  }

  setData(data: any) {
    this.data = data;
  }
}