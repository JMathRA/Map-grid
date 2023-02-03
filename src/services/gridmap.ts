import { createNoise2D } from "simplex-noise";
import { ColorRange, Config } from "./interfaces";

function chooseColor(value: number, colorRanges: ColorRange[]): string {
	for (const colorRange of colorRanges) {
		if (value >= colorRange.min && value <= colorRange.max) {
			return colorRange.color;
		}
	}
	return "black";
}

function blackAndWhiteColors(value: number): string {
	const lightness = scaleBetween(value, 0, 100, -1, 1);
	return `hsl(0, 0%, ${lightness}%)`;
}

function scaleBetween(unscaledNum: number, minAllowed: number, maxAllowed: number, min: number, max: number): number {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

function createHeightMap(width: number, height: number, frequency: number): number[][] {
	const map: number[][] = [];
	const noise2D = createNoise2D();
	const wavelength = width / frequency;

	for (let x = 0; x < width; x++) {
		map.push([]);
		for (let y = 0; y < height; y++) {
			const nx = x / wavelength;
			const ny = y / wavelength;
			let e = 1 * noise2D(1 * nx, 1 * ny)
				+ 0.5 * noise2D(2 * nx, 2 * ny)
				+ 0.25 * noise2D(4 * nx, 4 * ny);
			e = e / (1 + 0.5 + 0.25);
			map[x][y] = Math.pow(e, 1);
		}
	}
	return map;
}

function createHumidityMap(width: number, height: number, frequency: number): number[][] {
	const map: number[][] = [];
	const noise2D = createNoise2D();
	const wavelength = width / frequency;

	for (let x = 0; x < width; x++) {
		map.push([]);
		for (let y = 0; y < height; y++) {
			const nx = x / wavelength;
			const ny = y / wavelength;
			let e = 1 * noise2D(1 * nx, 1 * ny)
				+ 0.5 * noise2D(2 * nx, 2 * ny)
				+ 0.25 * noise2D(4 * nx, 4 * ny);
			e = e / (1 + 0.5 + 0.25);
			map[x][y] = Math.pow(e, 1);
		}
	}
	return map;
}

function get2DCanvas(name: string, config: Config): CanvasRenderingContext2D {
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

function drawGridMap(config: Config, colorRanges: ColorRange[]): number[][] {
	const ctx = get2DCanvas("map", config);
	const map = createHeightMap(config.width, config.height, config.frequency);
	const tilesizeCorrector = config.tilesize - 1 > 0 ? config.tilesize - 1 : 1;
	for (let i = 0; i < config.width; i++) {
		for (let j = 0; j < config.height; j++) {
			ctx.beginPath();
			ctx.rect(i * config.tilesize + i * config.gap, j * config.tilesize + j * config.gap, config.tilesize, config.tilesize);
			ctx.fillStyle = chooseColor(map[i][j], colorRanges);
			ctx.fill();
		}
	}
	return map;
}

function drawRawMap(rawMap: number[][], width: number, height: number, tilesize: number): void {
	const ctx = get2DCanvas("raw-map", { width, height, tilesize, gap: 0, frequency: 0 });
	for (let i = 0; i < rawMap.length; i++) {
		for (let j = 0; j < rawMap[i].length; j++) {
			ctx.beginPath();
			ctx.rect(i * tilesize, j * tilesize, tilesize, tilesize);
			ctx.fillStyle = blackAndWhiteColors(rawMap[i][j]);
			ctx.fill();
		}
	}
}

export function init(config: Config, colorRanges: ColorRange[]) {
	const rawMap = drawGridMap(config, colorRanges);
	drawRawMap(rawMap, config.width, config.height, 1);
}
