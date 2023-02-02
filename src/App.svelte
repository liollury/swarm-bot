<script lang="ts">
  import { onMount } from 'svelte';
  import { Robot } from './robots/robot';
  import { DrawBiteSimulation } from './scenarii/draw-bite';
  import { DrawOllySimulation } from './scenarii/draw-olly';
  import { DrawZSimulation } from './scenarii/draw-Z';
  import { DrawZenikaSimulation } from './scenarii/draw-zenika';
  import { ExpandedScenario } from './scenarii/expanded';
  import { NearByNearSeekScanario } from './scenarii/near-by-near-seek';
  import { NearSeekScenario } from './scenarii/near-seek';
  import { Scenario } from './scenarii/scenario';

  let simulation: Scenario;
  let selectedRobot: Robot;
  onMount(() => {
    // simulation = new ExpandedScenario();
    // simulation = new NearByNearSeekScanario();
    // simulation = new NearSeekScenario();
    // simulation = new DrawZSimulation();
    // simulation = new DrawOllySimulation();
    simulation = new DrawZenikaSimulation();
    // simulation = new DrawBiteSimulation();
    simulation.init(document.body.clientWidth - 10, document.body.clientHeight - 100);
    simulation.world.listenForSelectedRobot((robot: Robot) => selectedRobot = robot);
    simulation.start();
  });

  function tooglePlay() {
    if (simulation.simulationActive) {
      simulation.pause();
    } else {
      simulation.start();
    }
  }

</script>

<main>
    <div id="simulation"></div>
    <div class="info-bloc">
        <button on:click={tooglePlay}>Play / pause</button>
        {#if selectedRobot}
            <ul>
                <li>X : {selectedRobot.x}</li>
                <li>Y : {selectedRobot.y}</li>
                <li>data : {JSON.stringify(selectedRobot.data)}</li>
                <li>vector : {selectedRobot.velocityVector.x};{selectedRobot.velocityVector.y}</li>
            </ul>
        {/if}
    </div>
</main>

<style>
    .info-bloc {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
</style>