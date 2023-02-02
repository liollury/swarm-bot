import { DrawerRobot } from '../robots/drawer-robot';
import { StaticRobot } from '../robots/static-robot';
import { Vector } from '../vector';
import { World } from '../world';
import { Scenario } from './scenario';

export abstract class DrawSimulation extends Scenario {
  public abstract shape: number[][];
  startPosition: Vector;
  staticBotPosition: Vector = Vector.nullVector();

  init(width: number, height: number) {
    const robotCount = this.shape.reduce((prevY: number, currY: number[]) => prevY + currY.reduce((prevX: number, currX: number) => prevX + currX, 0), 0);
    this.world = new World(width, height);
    this.world.speed = 3;

    let staticRobot;
    if (this.startPosition) {
      staticRobot = new StaticRobot(this.startPosition.x, this.startPosition.y, 10, 1, 100);
    }else {
      staticRobot = new StaticRobot(width * Math.random(), height * Math.random(), 10, 1, 100);
    }
    staticRobot.setData({
      objectId: 0,
      placed: true,
      shapePosition: this.staticBotPosition,
      targetPosition: this.staticBotPosition,
    })
    staticRobot.color = '#33ee33';
    staticRobot.id = 0;

    this.world.generateRobotsRandom(new DrawerRobot(0, 0, 10, 3, 100, this.shape), robotCount - 1, 600, 600);
    this.world.robots.push(staticRobot);
    this.world.init();
  }

}