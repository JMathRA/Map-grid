import { createNoise2D } from "simplex-noise";
import { ColorRange, Config, ConfigLight } from "./interfaces";

export default class GridMapGenerator {
	private colorRanges: ColorRange[];
	// HEIGHT MAP
	private heightMapConfig: Config;
	private heightMap: number[][] = [];
	private heightMapNoise: ((x: number, y: number) => number) | undefined;
	// MOISTURE MAP
	private moistureMapConfig: ConfigLight;
	private moistureMap: number[][] = [];
	private moistureMapNoise: ((x: number, y: number) => number) | undefined;

	constructor(heightMapConfig: Config, moistureMapConfig: ConfigLight, colorRanges: ColorRange[]) {
		this.heightMapConfig = heightMapConfig;
		this.moistureMapConfig = moistureMapConfig;
		this.colorRanges = colorRanges;
	}

	public draw(shouldRegenerate?: boolean): void {
		this.drawGridMap(shouldRegenerate);
		this.createMoistureMap();
		this.drawRawMap(
			"raw-height-map",
			this.heightMap,
			this.heightMapConfig.width,
			this.heightMapConfig.height,
			1,
			this.heightMapConfig.octaves
		);
		this.drawRawMap(
			"raw-moisture-map",
			this.moistureMap,
			this.heightMapConfig.width,
			this.heightMapConfig.height,
			1,
			this.moistureMapConfig.octaves
		);
	}

	public setColorRanges(colorRanges: ColorRange[]): void {
		this.colorRanges = colorRanges;
	}

	public setHeightMapConfig(config: Config): void {
		this.heightMapConfig = config;
	}

	public setMoistureMapConfig(config: ConfigLight): void {
		this.moistureMapConfig = config;
	}

	private createMoistureMap(): void {
		const map: number[][] = [];
		this.moistureMapNoise = createNoise2D();
		const wavelengthX = this.heightMapConfig.width / this.moistureMapConfig.frequency;
		const wavelengthY = this.heightMapConfig.height / this.moistureMapConfig.frequency;

		for (let x = 0; x < this.heightMapConfig.width; x++) {
			map.push([]);
			for (let y = 0; y < this.heightMapConfig.height; y++) {
				const nx = x / wavelengthX;
				const ny = y / wavelengthY;
				let e = 0;
				let acc = 0;
				for (let o = 0; o < this.moistureMapConfig.octaves; o++) {
					acc += 1 / Math.pow(2, o);
					e += this.moistureMapNoise(Math.pow(2, o) * nx, Math.pow(2, o) * ny) / Math.pow(2, o);
				}
				e = e / acc;
				map[x][y] = Math.pow(e, 1);
			}
		}
		this.moistureMap = map;
	}

	private createHeightMap(shouldRegenerate?: boolean): void {
		const map: number[][] = [];
		if (shouldRegenerate || !this.heightMapNoise) {
			this.heightMapNoise = createNoise2D();
		}
		const wavelengthX = this.heightMapConfig.width / this.heightMapConfig.frequency;
		const wavelengthY = this.heightMapConfig.height / this.heightMapConfig.frequency;

		for (let x = 0; x < this.heightMapConfig.width; x++) {
			map.push([]);
			for (let y = 0; y < this.heightMapConfig.height; y++) {
				const nx = x / wavelengthX;
				const ny = y / wavelengthY;
				let e = 0;
				let acc = 0;
				for (let o = 0; o < this.heightMapConfig.octaves; o++) {
					acc += 1 / Math.pow(2, o);
					e += this.heightMapNoise(Math.pow(2, o) * nx, Math.pow(2, o) * ny) / Math.pow(2, o);
				}
				e = e / acc;
				map[x][y] = Math.pow(e, 1);
			}
		}
		this.heightMap = map;
	}

	private drawGridMap(shouldRegenerate?: boolean): void {
		const ctx = this.get2DCanvas("map", this.heightMapConfig);
		this.createHeightMap(shouldRegenerate);
		for (let i = 0; i < this.heightMapConfig.width; i++) {
			for (let j = 0; j < this.heightMapConfig.height; j++) {
				ctx.beginPath();
				ctx.rect(
					i * this.heightMapConfig.tilesize + i * this.heightMapConfig.gap,
					j * this.heightMapConfig.tilesize + j * this.heightMapConfig.gap,
					this.heightMapConfig.tilesize,
					this.heightMapConfig.tilesize
				);
				ctx.fillStyle = this.chooseColor(this.heightMap[i][j]);
				ctx.fill();
			}
		}
	}

	private drawRawMap(name: string, rawMap: number[][], width: number, height: number, tilesize: number, octaves: number): void {
		const ctx = this.get2DCanvas(name, { width, height, tilesize, gap: 0, frequency: 0, octaves });
		for (let i = 0; i < rawMap.length; i++) {
			for (let j = 0; j < rawMap[i].length; j++) {
				ctx.beginPath();
				ctx.rect(i * tilesize, j * tilesize, tilesize, tilesize);
				ctx.fillStyle = this.blackAndWhiteColors(rawMap[i][j]);
				ctx.fill();
			}
		}
	}

	private chooseColor(value: number): string {
		for (const colorRange of this.colorRanges) {
			if (value >= colorRange.min && value <= colorRange.max) {
				return colorRange.color;
			}
		}
		return "black";
	}

	private get2DCanvas(name: string, config: Config): CanvasRenderingContext2D {
		const canvas = document.getElementById(name) as HTMLCanvasElement | null;
		if (!canvas) {
			throw new Error("No canvas element found");
		}
		canvas.width = config.width * (config.tilesize + config.gap);
		canvas.height = config.height * (config.tilesize + config.gap);
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("No canvas context found");
		}
		return ctx;
	}

	private scaleBetween(
		unscaledNum: number,
		minAllowed: number,
		maxAllowed: number,
		min: number,
		max: number
	): number {
		return ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) + minAllowed;
	}

	private blackAndWhiteColors(value: number): string {
		const lightness = this.scaleBetween(value, 0, 100, -1, 1);
		return `hsl(0, 0%, ${lightness}%)`;
	}
}
