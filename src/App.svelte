<script lang="ts">
	import { onMount } from 'svelte';
	import { DrawZenikaSimulation } from './scenarii/draw-zenika';
	import { NearByNearSeekScanario } from './scenarii/near-by-near-seek';
	import { Scenario } from './scenarii/scenario';

	let canvas;
	let simulation: Scenario;
	const width = 1500;
	const height = 800;
	onMount(() => {
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		simulation = new NearByNearSeekScanario();
		simulation.init(ctx, width, height);
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
	<canvas bind:this="{canvas}"></canvas>
	<button on:click={tooglePlay}>Play / pause</button>
</main>

<style>
	canvas {
		border: 1px solid black;
	}
</style>