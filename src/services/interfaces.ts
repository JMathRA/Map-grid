export interface Point {
	x: number;
	y: number;
}

export interface Biome {
	coordinates: [Point, Point];
	color: string;
	name: string;
	id: number;
}

export interface Config {
	width: number;
	height: number;
	frequency: number;
	tilesize: number;
	gap: number;
	octaves: number;
}

export type ConfigLight = Pick<Config, "frequency" | "octaves">;
