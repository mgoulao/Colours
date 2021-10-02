/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export interface LightProperties {
	changed: boolean;
	playing: boolean;
	color: string;
	type: string;
	size: number;
}
