import type { World } from '../world';

export abstract class Scenario {
  world: World;
  public abstract init(ctx: CanvasRenderingContext2D, width: number, height: number);

  pause() {
    this.world.stopSimulation();
  }

  start() {
    this.world.startSimulation();
  }

  public get simulationActive(): boolean {
    return this.world?.simulationActive || false;
  }
}