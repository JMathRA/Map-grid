import { createNoise2D } from "simplex-noise";
import { Biome, Config, ConfigLight, Point } from "./interfaces";

export default class GridMapGenerator {
	private biomes: Biome[];
	public coloredMap: string[][] = [];
	// HEIGHT MAP
	private heightMapConfig: Config;
	private heightMap: number[][] = [];
	private heightMapNoise: ((x: number, y: number) => number) | undefined;
	// MOISTURE MAP
	private moistureMapConfig: ConfigLight;
	private moistureMap: number[][] = [];
	private moistureMapNoise: ((x: number, y: number) => number) | undefined;

	constructor(heightMapConfig: Config, moistureMapConfig: ConfigLight, biomes: Biome[]) {
		this.heightMapConfig = heightMapConfig;
		this.moistureMapConfig = moistureMapConfig;
		this.biomes = biomes;
	}

	public draw(shouldRegenerate: boolean): void {
		this.createMoistureMap();
		this.drawGridMap(shouldRegenerate);
		this.drawRawMap(
			"raw-height-map",
			this.heightMap,
			this.heightMapConfig.width,
			this.heightMapConfig.height,
			1,
		);
		this.drawRawMap(
			"raw-moisture-map",
			this.moistureMap,
			this.heightMapConfig.width,
			this.heightMapConfig.height,
			1,
		);
	}

	public drawColorRanges(): void {
		const tilesize = 1;
		const gap = 0;
		const width = 100;
		const height = 100;
		const ctx = this.get2DCanvas("biome-map", width, height, tilesize, gap);
		ctx.translate(0, height);
		ctx.scale(1, -1);
		const scalePos = (x: number) => this.scaleBetween(x, 0, width, -1, 1);
		const scaleSize = (x: number) => this.scaleBetween(x, 0, width, 0, 2);
		for (const biome of this.biomes) {
			ctx.beginPath();
			ctx.rect(
				scalePos(biome.coordinates[0].x),
				scalePos(biome.coordinates[0].y),
				Math.abs(scaleSize(biome.coordinates[1].x - biome.coordinates[0].x)),
				Math.abs(scaleSize(biome.coordinates[1].y - biome.coordinates[0].y)),
			);
			ctx.fillStyle = biome.color;
			ctx.fill();
		}
	}

	public dist(p1: Point, p2: Point): number {
		return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
	}

	public setColorRanges(biomes: Biome[]): void {
		this.biomes = biomes;
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
					acc += 1 / 2 ** o;
					e += this.moistureMapNoise((2 ** o) * nx, (2 ** o) * ny) / (2 ** o);
				}
				e = e / acc;
				map[x][y] = e ** 1;
			}
		}
		this.moistureMap = map;
	}

	private createHeightMap(shouldRegenerate: boolean): void {
		const map: number[][] = [];
		if (shouldRegenerate || this.heightMapNoise === undefined) {
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

	private drawGridMap(shouldRegenerate: boolean): void {
		const ctx = this.get2DCanvas(
			"map",
			this.heightMapConfig.width,
			this.heightMapConfig.height,
			this.heightMapConfig.tilesize,
			this.heightMapConfig.gap
		);
		this.createHeightMap(shouldRegenerate);
		this.coloredMap = [];
		for (let i = 0; i < this.heightMapConfig.width; i++) {
			this.coloredMap.push([]);
			for (let j = 0; j < this.heightMapConfig.height; j++) {
				ctx.beginPath();
				ctx.rect(
					i * this.heightMapConfig.tilesize + i * this.heightMapConfig.gap,
					j * this.heightMapConfig.tilesize + j * this.heightMapConfig.gap,
					this.heightMapConfig.tilesize,
					this.heightMapConfig.tilesize
				);
				const color = this.chooseColor(this.heightMap[i][j], this.moistureMap[i][j]);
				ctx.fillStyle = color;
				this.coloredMap[i][j] = color;
				ctx.fill();
			}
		}
	}

	private drawRawMap(
		name: string,
		rawMap: number[][],
		width: number,
		height: number,
		tilesize: number,
	): void {
		const ctx = this.get2DCanvas(name, width, height, tilesize, 0);
		for (let i = 0; i < rawMap.length; i++) {
			for (let j = 0; j < rawMap[i].length; j++) {
				ctx.beginPath();
				ctx.rect(i * tilesize, j * tilesize, tilesize, tilesize);
				ctx.fillStyle = this.blackAndWhiteColors(rawMap[i][j]);
				ctx.fill();
			}
		}
	}

	private chooseColor(x: number, y: number): string {
		const matchingBiomes: Biome[] = this.biomes.filter(biome => {
			return (
				x >= biome.coordinates[0].x &&
				x <= biome.coordinates[1].x &&
				y >= biome.coordinates[0].y &&
				y <= biome.coordinates[1].y
			);
		});
		return matchingBiomes.at(-1)?.color ?? "black";
	}

	private get2DCanvas(
		name: string,
		width: number,
		height: number,
		tilesize: number,
		gap: number
	): CanvasRenderingContext2D {
		const canvas = document.getElementById(name) as HTMLCanvasElement | null;
		if (!canvas) {
			throw new Error("No canvas element found");
		}
		canvas.width = width * (tilesize + gap);
		canvas.height = height * (tilesize + gap);
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
