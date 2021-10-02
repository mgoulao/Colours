<script lang="ts">
import { lightStore } from "../stores";
import { onMount } from 'svelte';
import type { LightProperties } from "./types";
import HsvPicker from "./HSVPicker.svelte";

onMount(() => {
    document.addEventListener('keypress', (event) => {
        if (event.composedPath()[0].tagName && ["INPUT", "SELECT", "TEXTAREA"].includes(event.composedPath()[0].tagName)) {
            return true;
        }
        
        switch(event.key) {
            case " ":
                //play
                break;
            case "f":
            case "F":
                toggleFullScreen();
                break;
            case "h":
            case "H":
                toggleControllerVisibility();
                break;
        }
        return false;
    });
})

let lightProps: LightProperties;

lightStore.subscribe(value => {
    lightProps = value;
});

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
        document.body.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

const onLightTypeChange = (event) => {
    lightStore.setType(event.target.value);
}

const onColorInputChange = (event) => {
    lightStore.setColor(event.target.value);
}

const onColorPickerChange = (value) => {
    lightStore.setColor(value.detail.hex);
}

const onSizeChange = (event) => {
    lightStore.setSize(event.target.value);
}

const onFullScreenClick = () => {
    toggleFullScreen();
}

const toggleControllerVisibility = () => {
    if (document.getElementById("controller").classList.contains("hidden")) {
        onShowClick();
    } else {
        onHideClick();
    }
}

const onHideClick = () => {
    document.getElementById("controller").classList.add("hidden");
    document.getElementById("controller-show-btn").classList.add("active");
}
const onShowClick = () => {
    document.getElementById("controller").classList.remove("hidden");
    document.getElementById("controller-show-btn").classList.remove("active");
}
</script>

<button id="controller-show-btn" on:click={onShowClick}>Show</button>
<div id="controller">
    <button id="hide-btn" on:click={onHideClick}>Hide</button>
    <button id="full-screen-btn" on:click={onFullScreenClick}>Full Screen</button>
    <select id="light-type-selector" on:change={onLightTypeChange}>
        <option value="fill" selected={lightProps.type == "fill"}>Fill</option>
        <option value="ring" selected={lightProps.type == "ring"}>Ring</option>
    </select>
    <input type="range" id="size-slider" on:input={onSizeChange} name="size" value="100" min="10" max="100">
    <input id="base-color-input" value={lightProps.color} on:change={onColorInputChange}>
    <HsvPicker on:colorChange={onColorPickerChange} startColor={"#FBFBFB"}/>
</div>
<style>
#controller {
    position: fixed;
    right: 6px;
    top: 32px;
    width: 400px;
    height: calc(100% - 64px);
    background-color: #222;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 12px;
    transition: right 0.7s ease;
    box-sizing: border-box;
}
:global(#controller.hidden) {
    right: -500px;
}
#controller-show-btn {
    position: fixed;
    display: none;
    top: 32px;
    right: 0;
}
:global(#controller-show-btn.active) {
    display: block;
}
</style>
