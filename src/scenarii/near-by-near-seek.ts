import { DrawerRobot } from '../robots/drawer-robot';
import { NearByNearSeekRobot } from '../robots/near-by-near-seek-robot';
import { StaticRobot } from '../robots/static-robot';
import { World } from '../world';
import { Scenario } from './scenario';

export class NearByNearSeekScanario extends Scenario {
  init(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.world = new World(width, height);
    this.world.ctx = ctx;
    this.world.speed = 200;
    // Seek and catch
    // world.generateRobotsGrid(new NearByNearSeekRobot(0, 0, 10, 1, 100), 6, 4, 20, 20);
    this.world.generateRobotsRandom(new NearByNearSeekRobot(0, 0, 10, 1, 100), 20, 600, 600);
    for(let i = 0; i < 1; i++) {
      // const staticRobot = new StaticRobot(width * Math.random(), height * Math.random(), 10, 1, 100);
      const staticRobot = new StaticRobot(width / 2, height / 2, 10, 1, 100);
      staticRobot.color = '#33ee33';
      staticRobot.id = 0;
      this.world.robots.push(staticRobot);
    }
  }

}