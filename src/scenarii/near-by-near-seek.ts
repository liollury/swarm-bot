import { DrawerRobot } from '../robots/drawer-robot';
import { NearByNearSeekRobot } from '../robots/near-by-near-seek-robot';
import { StaticRobot } from '../robots/static-robot';
import { World } from '../world';
import { Scenario } from './scenario';

export class NearByNearSeekScanario extends Scenario {
  init(width: number, height: number) {
    this.world = new World(width, height);
    this.world.speed = 1.5;
    // Seek and catch
    // world.generateRobotsGrid(new NearByNearSeekRobot(0, 0, 10, 1, 100), 6, 4, 20, 20);
    this.world.generateRobotsRandom(new NearByNearSeekRobot(0, 0, 10, 10, 100), 20, 600, 600);
    const staticRobot = new StaticRobot(width / 2, height / 2, 10, 0, 0);
    staticRobot.id = 0;
    this.world.robots.push(staticRobot);
    this.world.init();
  }

}