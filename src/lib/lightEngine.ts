import type { LightStore } from '../stores';
import type { LightProperties } from './types';

export class LightEngine {
	canvas: HTMLCanvasElement;
	store: LightStore;
	state: LightProperties;
	ctx: CanvasRenderingContext2D;
	lastFrameTime = 0;

	constructor(canvas: HTMLCanvasElement, store: LightStore) {
		this.canvas = canvas;
		this.store = store;
		this.store.subscribe(this.onStoreChanges);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.canvas.width = window.innerWidth;
		this.ctx.canvas.height = window.innerHeight;

		this.createFrame();
		this.setupListeners();
	}

	setupListeners(): void {
		window.addEventListener('resize', () => {
			this.ctx.canvas.width = window.innerWidth;
			this.ctx.canvas.height = window.innerHeight;
			this.createFrame();
		});
	}

	clearScreen(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	createFrame = (): void => {
		this.clearScreen();
		const sizeFactor = this.state.size / 100;
		switch (this.state.type) {
			case 'ring': {
				const bigRadius = Math.min(this.ctx.canvas.width, this.ctx.canvas.height) / 2 - 20;
				const smallRadius = bigRadius - 50;
				this.ctx.beginPath();
				this.ctx.fillStyle = this.state.color;
				this.ctx.ellipse(
					this.ctx.canvas.width / 2,
					this.ctx.canvas.height / 2,
					bigRadius * sizeFactor,
					bigRadius * sizeFactor,
					0,
					0,
					2 * Math.PI
				);
				this.ctx.fill();
				this.ctx.beginPath();
				this.ctx.fillStyle = '#000';
				this.ctx.ellipse(
					this.ctx.canvas.width / 2,
					this.ctx.canvas.height / 2,
					smallRadius * sizeFactor,
					smallRadius * sizeFactor,
					0,
					0,
					2 * Math.PI
				);
				this.ctx.fill();
				break;
			}
			case 'fill':
			default: {
				this.ctx.fillStyle = this.state.color;
                const originX =  this.canvas.width * (1 - sizeFactor) / 2;
                const originY =  this.canvas.height * (1 - sizeFactor) / 2;
				this.ctx.fillRect(originX, originY, this.canvas.width * sizeFactor, this.canvas.height * sizeFactor);
            }
		}

	};

	play(): void {
		const currentFrameTime = Date.now();
		if (Date.now() - this.lastFrameTime > 1000/(this.state.bpm/60)) {
			this.lastFrameTime = currentFrameTime;
			this.createFrame();
			console.log(Date.now());
		}
		
		if (this.state.playing) {
			window.requestAnimationFrame(this.play.bind(this));
		}
	}

	startPlay(): void {
		window.requestAnimationFrame(this.play.bind(this));
	}

	onStoreChanges = (value: LightProperties): void => {
		const wasPlaying = this.state?.playing;
		this.state = value;
		if (value.changed) {
			if (!wasPlaying){
				if (this.state.playing) {
					this.startPlay();
				} else {
					window.requestAnimationFrame(this.createFrame);
				}
			}
		}
	};
}
