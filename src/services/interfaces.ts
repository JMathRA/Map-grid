export interface ColorRange {
	min: number;
	max: number;
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
