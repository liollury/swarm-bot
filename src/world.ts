import Matter, {
  Composite,
  Engine,
  IChamferableBodyDefinition, IMouseEvent, MouseConstraint,
  Render,
  Runner,
  Vector as MatterVector
} from 'matter-js';
import type { NearInformation } from './near-information';
import { ExpandedRobot } from './robots/expanded-robot';
import type { Robot } from './robots/robot';
import { Vector } from './vector';

export class World {
  speed: number;
  robots: Robot[] = [];
  ctx: CanvasRenderingContext2D;
  timer;
  simulationActive = false;
  engine: Engine;
  render: Render;
  runner: Runner;
  mouseConstraint: MouseConstraint;
  selectedRobot: Robot;
  selectedRobotListener: (robot: Robot) => {};
  tickNumber = 0;

  constructor(protected width: number, protected height: number) {
    // module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    // create an engine
    this.engine = Engine.create();
    this.engine.gravity.y = 0;

    // create a renderer
    this.render = Render.create({
      element: document.querySelector('#simulation'),
      engine: this.engine,
      options: {
        width,
        height,
        wireframes: false
      }
    });
    const wallOptions: IChamferableBodyDefinition = { isStatic: true, render: { fillStyle: 'white' } };
    const wallWidth = 20;
    const top = Bodies.rectangle(width / 2, 0, width, wallWidth, wallOptions);
    const bottom = Bodies.rectangle(width / 2, height, width, wallWidth, wallOptions);
    const left = Bodies.rectangle(0, height / 2, wallWidth, height, wallOptions);
    const right = Bodies.rectangle(width, height / 2, wallWidth, height, wallOptions);

    Composite.add(this.engine.world, [top, bottom, left, right]);
    Render.run(this.render);
    this.runner = Runner.create();

    Matter.Events.on(this.engine, 'collisionStart', function(event) {
      // console.log(event.pairs[0], event.pairs[1]);
      // Now do something with the event and elements ... your task ;-)
    });
  }

  init() {
    Composite.add(this.engine.world, this.robots.map((robot: Robot) => robot.body));
    this.listenForClick();
  }

  startSimulation() {
    this.robots.forEach((robot: Robot) => robot.world = this);
    Matter.Events.on(this.runner, 'tick', () => {
      this.tickNumber++;
      this.robots.forEach((robot: Robot) => {
        if (this.selectedRobotListener && this.selectedRobot) {
          this.selectedRobotListener(this.selectedRobot);
        }
        robot.velocityVector = new Vector(robot.body.velocity.x, robot.body.velocity.y);
        robot.tick(this.tickNumber);
        Matter.Body.setVelocity(robot.body, MatterVector.create(robot.velocityVector?.x || 0, robot.velocityVector?.y || 0));
      });

    });
    Runner.run(this.runner, this.engine);
    this.simulationActive = true;
  }

  stopSimulation() {
    Runner.stop(this.runner);
    this.simulationActive = false;
  }

  listenForClick() {
    document.getElementsByTagName('canvas')[0].addEventListener('click', (event: MouseEvent) => {
      if (this.selectedRobot) {
        this.selectedRobot.body.render.fillStyle = this.selectedRobot.options.render.fillStyle;
        this.selectedRobot = null;
      }
      const mousePosition = new Vector(event.offsetX, event.offsetY);
      const robot = this.robots.find((robot: Robot) => {
        return mousePosition.x > robot.x - robot.radius &&
          mousePosition.x < robot.x + robot.radius &&
          mousePosition.y > robot.y - robot.radius &&
          mousePosition.y < robot.y + robot.radius;
      });
      if (robot) {
        this.selectedRobot = robot;
        this.selectedRobot.body.render.fillStyle = '#ff0000';
        if (this.selectedRobotListener) {
          this.selectedRobotListener(this.selectedRobot);
        }
      }
    });
  }

  public listenForSelectedRobot(callback: (robot: Robot) => {}) {
    this.selectedRobotListener = callback;
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