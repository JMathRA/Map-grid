import { createNoise2D } from "simplex-noise";
import { ColorRange } from "./interfaces";

export let colorRanges: ColorRange[] = [
	{
		min: -1,
		max: 0,
		color: "#0081C9",
		name: "water",
	},
	{
		min: 0,
		max: 0.1,
		color: "#FFD56F",
		name: "sand",
	},
	{
		min: 0.1,
		max: 0.5,
		color: "#367E18", // convert to hex color
		name: "grass",
	},
	{
		min: 0.5,
		max: 1,
		color: "#473C33",
		name: "rock",
	},
];

function chooseColor(value: number): string {
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

function get2DCanvas(name: string, width: number, height: number, tilesize: number): CanvasRenderingContext2D {
	const canvas = document.getElementById(name) as HTMLCanvasElement | null;
	if (!canvas) {
		throw new Error("No canvas element found");
	}
	canvas.width = width * tilesize;
	canvas.height = height * tilesize;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("No canvas context found");
	}
	return ctx;
}

function drawGridMap(width: number, height: number, tilesize: number): number[][] {
	const ctx = get2DCanvas("map", width, height, tilesize);
	const map = createHeightMap(width, height, 2);
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			ctx.beginPath();
			ctx.rect(i * tilesize, j * tilesize, tilesize - 1, tilesize - 1);
			ctx.fillStyle = chooseColor(map[i][j]);
			ctx.fill();
		}
	}
	return map;
}

function drawRawMap(rawMap: number[][], width: number, height: number, tilesize: number): void {
	const ctx = get2DCanvas("raw-map", width, height, tilesize);
	for (let i = 0; i < rawMap.length; i++) {
		for (let j = 0; j < rawMap[i].length; j++) {
			ctx.beginPath();
			ctx.rect(i * tilesize, j * tilesize, tilesize, tilesize);
			ctx.fillStyle = blackAndWhiteColors(rawMap[i][j]);
			ctx.fill();
		}
	}
}

export function init(width: number, height: number) {
	const rawMap = drawGridMap(width, height, 8);
	drawRawMap(rawMap, width, height, 2);
}
