import { writable } from 'svelte/store';
import type { LightProperties } from './lib/types';

const initLightStore: LightProperties = {
    changed: false,
    playing: false,
    type: "ring",
    color: "#aaa",
    size: 100,
    bpm: 70
}

export interface LightStore {
    subscribe;
    setColor;
    setType;
    reset;
}

function createLightStore() {
	const { subscribe, set, update } = writable(initLightStore);

	return {
		subscribe,
		setColor: (color) => { update(n => { return {...n, color, changed: true}}) },
		setType: (type) => { update(n => { return {...n, type, changed: true}}) },
		setSize: (size) => { update(n => { return {...n, size, changed: true}}) },
		setBPM: (bpm) => { update(n => { return {...n, bpm, changed: true}}) },
		play: () => { update(n => { return {...n, playing: true, changed: true}}) },
		stop: () => { update(n => { return {...n, playing: false, changed: true}}) },
		resetChanged: () => { update(n => { return {...n, changed: false}}) },
		reset: () => initLightStore
	};
}

export const lightStore = createLightStore();