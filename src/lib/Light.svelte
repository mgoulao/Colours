<script lang="ts">
    import { lightStore } from '../stores';
    import { LightEngine } from "./lightEngine";
    import { onMount } from 'svelte';

    onMount(() => {
        const engine = new LightEngine(document.getElementById("light"), lightStore);
    });

</script>

<div class="light-container">
    <canvas id="light"></canvas>
</div>

<style>
.light-container {
    position: relative;
    background-color: #000;
    width: 100vw;
    height: 100vh;
}
#light {
    position: relative;
    width: 100%;
    height: 100%;
    margin: auto;
    
}
</style>
