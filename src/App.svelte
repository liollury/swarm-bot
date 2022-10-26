<script lang="ts">
  import { onMount } from 'svelte';
  import { DrawBiteSimulation } from './scenarii/draw-bite';
  import { DrawOllySimulation } from './scenarii/draw-olly';
  import { DrawZSimulation } from './scenarii/draw-Z';
  import { DrawZenikaSimulation } from './scenarii/draw-zenika';
  import { ExpandedScenario } from './scenarii/expanded';
  import { NearByNearSeekScanario } from './scenarii/near-by-near-seek';
  import { NearSeekScenario } from './scenarii/near-seek';

  let simulation;

  onMount(() => {
    // simulation = new ExpandedScenario();
    // simulation = new NearByNearSeekScanario();
    // simulation = new NearSeekScenario();
    // simulation = new DrawZSimulation();
    simulation = new DrawOllySimulation();
    // simulation = new DrawZenikaSimulation();
    // simulation = new DrawBiteSimulation();
    simulation.init(1500, 800);
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

    <button on:click={tooglePlay}>Play / pause</button>
</main>

<style>
    canvas {
        border: 1px solid black;
    }
</style>