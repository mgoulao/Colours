<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Light from '$lib/Light.svelte';
	import Controller from '$lib/Controller.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<Light></Light>
<Controller></Controller>

<style>
html {
	width: 100%;
	height: 100%;
}
body {
	width: 100%;
	height: 100%;
}
</style>
