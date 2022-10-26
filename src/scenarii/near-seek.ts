import { NearSeekRobot } from '../robots/near-seek-robot';
import { StaticRobot } from '../robots/static-robot';
import { World } from '../world';
import { Scenario } from './scenario';

export class NearSeekScenario extends Scenario {
  init(width: number, height: number) {
    this.world = new World(width, height);
    this.world.speed = 200;
    // Seek and catch
    // world.generateRobotsGrid(new NearByNearSeekRobot(0, 0, 10, 1, 100), 6, 4, 20, 20);
    this.world.generateRobotsRandom(new NearSeekRobot(0, 0, 10, 5, 100), 20, 600, 600);
    const staticRobot = new StaticRobot(width / 2, height / 2, 10, 1, 100);
    staticRobot.color = '#33ee33';
    staticRobot.id = 0;
    this.world.robots.push(staticRobot);
    this.world.init();
  }

}