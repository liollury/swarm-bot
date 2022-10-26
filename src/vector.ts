export class Vector {
  constructor(
    public x: number,
    public y: number
  ) {}

  add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(vector: Vector): Vector {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  get size(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  scale(scale: number): Vector {
    return new Vector(this.x * scale, this.y * scale);
  }

  static nullVector(): Vector {
    return new Vector(0, 0);
  }
}