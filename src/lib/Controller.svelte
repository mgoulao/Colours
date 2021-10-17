<script lang="ts">
	import { lightStore } from '../stores';
	import { onMount } from 'svelte';
	import type { LightProperties } from './types';
	import HsvPicker from './HSVPicker.svelte';

	onMount(() => {
		document.addEventListener('keypress', (event) => {
			if (
				event.composedPath()[0].tagName &&
				['INPUT', 'SELECT', 'TEXTAREA'].includes(event.composedPath()[0].tagName)
			) {
				return true;
			}

			switch (event.key) {
				case ' ':
					//play
					break;
				case 'f':
				case 'F':
					toggleFullScreen();
					break;
				case 'h':
				case 'H':
					toggleControllerVisibility();
					break;
			}
			return false;
		});

		document.addEventListener('click', (event) => {
			showColorPicker = false;
		});


	});

	let lightProps: LightProperties;
    let showColorPicker: boolean = false;

	lightStore.subscribe((value) => {
		lightProps = value;
	});

	const toggleFullScreen = () => {
		if (!document.fullscreenElement) {
			document.body.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	};

	const onLightTypeChange = (event) => {
		lightStore.setType(event.target.value);
	};

    const onColorInputFocus = (event) => {
        showColorPicker = true;
		event.stopPropagation();
    }

	const onColorInputChange = (event) => {
		lightStore.setColor(event.target.value);
	};

	const onColorPickerChange = (value) => {
		lightStore.setColor(value.detail.hex);
	};

	const onSizeChange = (event) => {
		lightStore.setSize(event.target.value);
	};
	
	const onPlayStopClick = (event) => {
		if (lightProps.playing) {
			lightStore.stop();
		} else {
			lightStore.play();
		}
	}

	const onBPMChange = (event) => {
		lightStore.setBPM(event.target.value);
	};


	const onFullScreenClick = () => {
		toggleFullScreen();
	};

	const toggleControllerVisibility = () => {
		if (document.getElementById('controller').classList.contains('hidden')) {
			onShowClick();
		} else {
			onHideClick();
		}
	};

	const onHideClick = () => {
		document.getElementById('controller').classList.add('hidden');
		document.getElementById('controller-show-btn').classList.add('active');
	};
	const onShowClick = () => {
		document.getElementById('controller').classList.remove('hidden');
		document.getElementById('controller-show-btn').classList.remove('active');
	};
</script>

<button id="controller-show-btn" on:click={onShowClick}>
	<svg style="width:24px;height:24px" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M18,11H10L13.5,7.5L12.08,6.08L6.16,12L12.08,17.92L13.5,16.5L10,13H18V11Z"
		/>
	</svg>
</button>
<div id="controller">
	<div id="controller__header">
        <button id="hide-btn" on:click={onHideClick}>
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M6,13H14L10.5,16.5L11.92,17.92L17.84,12L11.92,6.08L10.5,7.5L14,11H6V13Z"
                />
            </svg>
        </button>
        <div class="controller-header__spacer"></div>
		<button id="full-screen-btn" on:click={onFullScreenClick}>
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"
				/>
			</svg>
            </button>
	</div>
	<div id="controller__content">
		<div class="controller__item">
			<h5 class="controler-item__title">Type</h5>
			<select id="light-type-selector" on:change={onLightTypeChange}>
				<option value="fill" selected={lightProps.type == 'fill'}>Fill</option>
				<option value="ring" selected={lightProps.type == 'ring'}>Ring</option>
			</select>
		</div>
		<div class="controller__item">
			<h5 class="controler-item__title">Size</h5>
			<input
                class="controler__range-input"
				type="range"
				id="size-slider"
				on:input={onSizeChange}
				name="size"
				value={lightProps.size}
				min="10"
				max="100"
			/>
		</div>
		<div class="controller__item" on:click={onColorInputFocus} >
			<h5 class="controler-item__title">Color</h5>
			<input id="base-color-input" value={lightProps.color} on:change={onColorInputChange} />
            {#if showColorPicker}
                <HsvPicker on:colorChange={onColorPickerChange} startColor={lightProps.color} />
            {/if}
		</div>
		<div class="controller__item">
			<h5 class="controler-item__title">Animation</h5>
			<button id="play_btn" on:click={onPlayStopClick}>{#if lightProps.playing}Stop{:else}Play{/if}</button>
			<div class="controller__horizontal">
				<span>BPM</span>
				<span>{lightProps.bpm}</span>
			</div>
			<input
                class="controler__range-input"
				type="range"
				id="bpm-slider"
				on:input={onBPMChange}
				name="bpm"
				value={lightProps.bpm}
				min="10"
				max="150"
			/>
			<div class="controller_animation-track">
				<input id="base-color-input" value={lightProps.color} on:change={onColorInputChange} />
				{#if showColorPicker}
					<HsvPicker on:colorChange={onColorPickerChange} startColor={lightProps.color} />
				{/if}
				<button>Add</button>
			</div>
		</div>
	</div>
</div>

<style>
	#controller {
		position: fixed;
		right: 6px;
		top: 32px;
		width: 250px;
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

    #controller__header {
        width: 100%;
        display: flex;
    }

    .controller-header__spacer {
        flex:1;
    }

	.controler-item__title {
		color: #fff;
        font-weight: 400;
        margin: 12px 0;
	}
    
    .controler__range-input {
        width: 100%;
    }

	.controller__horizontal {
		color: #fff
	}
</style>
