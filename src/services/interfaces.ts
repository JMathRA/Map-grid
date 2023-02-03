export interface Point {
	x: number;
	y: number;
}

export interface ColorRange {
	min: number;
	max: number;
	// coordinates: [Point, Point];
	color: string;
	name: string;
}

export interface Config {
	width: number;
	height: number;
	frequency: number;
	tilesize: number;
	gap: number;
	octaves: number;
}


export interface ConfigLight {
	frequency: number;
	octaves: number;
}
