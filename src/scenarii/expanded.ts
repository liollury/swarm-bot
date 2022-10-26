import { ExpandedRobot } from '../robots/expanded-robot';
import { World } from '../world';
import { Scenario } from './scenario';

export class ExpandedScenario extends Scenario {
  init(width: number, height: number) {
    this.world = new World(width, height);
    this.world.speed = 200;
    this.world.generateRobotsRandom(new ExpandedRobot(0, 0, 10, 1, 100), 20, 600, 600);
    this.world.init();
  }

}