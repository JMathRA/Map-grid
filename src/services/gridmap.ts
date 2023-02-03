import { createNoise2D } from "simplex-noise";
import { ColorRange, Config } from "./interfaces";

export default class GridMapGenerator {
	private config: Config;
	private colorRanges: ColorRange[];
	private heightMap: number[][] = [];
	private noise2D: ((x: number, y: number) => number) | undefined;

	constructor(config: Config, colorRanges: ColorRange[]) {
		this.config = config;
		this.colorRanges = colorRanges;
	}

	public draw(shouldRegenerate?: boolean): void {
		this.drawGridMap(shouldRegenerate);
		this.drawRawMap(this.heightMap, this.config.width, this.config.height, 1, this.config.octaves);
	}

	public setColorRanges(colorRanges: ColorRange[]): void {
		this.colorRanges = colorRanges.sort((a, b) => a.min - b.min);
	}

	public setConfig(config: Config): void {
		this.config = config;
	}

	private createHeightMap(shouldRegenerate?: boolean): void {
		const map: number[][] = [];
		if (shouldRegenerate || !this.noise2D) {
			this.noise2D = createNoise2D();
		}
		const wavelengthX = this.config.width / this.config.frequency;
		const wavelengthY = this.config.height / this.config.frequency;

		for (let x = 0; x < this.config.width; x++) {
			map.push([]);
			for (let y = 0; y < this.config.height; y++) {
				const nx = x / wavelengthX;
				const ny = y / wavelengthY;
				let e = 0;
				let acc = 0;
				for (let o = 0; o < this.config.octaves; o++) {
					acc += 1 / Math.pow(2, o);
					e += this.noise2D(Math.pow(2, o) * nx, Math.pow(2, o) * ny) / Math.pow(2, o);
				}
				e = e / acc;
				map[x][y] = Math.pow(e, 1);
			}
		}
		this.heightMap = map;
	}

	private drawGridMap(shouldRegenerate?: boolean): void {
		const ctx = this.get2DCanvas("map", this.config);
		this.createHeightMap(shouldRegenerate);
		for (let i = 0; i < this.config.width; i++) {
			for (let j = 0; j < this.config.height; j++) {
				ctx.beginPath();
				ctx.rect(i * this.config.tilesize + i * this.config.gap, j * this.config.tilesize + j * this.config.gap, this.config.tilesize, this.config.tilesize);
				ctx.fillStyle = this.chooseColor(this.heightMap[i][j]);
				ctx.fill();
			}
		}
	}

	private drawRawMap(rawMap: number[][], width: number, height: number, tilesize: number, octaves: number): void {
		const ctx = this.get2DCanvas("raw-map", { width, height, tilesize, gap: 0, frequency: 0, octaves });
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


	private scaleBetween(unscaledNum: number, minAllowed: number, maxAllowed: number, min: number, max: number): number {
		return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
	}

	private blackAndWhiteColors(value: number): string {
		const lightness = this.scaleBetween(value, 0, 100, -1, 1);
		return `hsl(0, 0%, ${lightness}%)`;
	}
}
