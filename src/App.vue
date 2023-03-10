<template>
	<Teleport to="body">
		<Modal @close="closeModal" class="w-sm">
			<form
				class="flex flex-col gap-4 bg-slate-300 dark:bg-slate-600 rounded-xl p-2"
				@submit.prevent="changeBiome"
			>
				<div class="flex flex-col gap-4">
					<div class="flex flex-row justify-center gap-2">
						<div class="flex flex-col items-center w-1/6">
							<label for="color-new" class="mb-1 text-xs text-slate-700 dark:text-slate-300">Color</label>
							<input type="color" v-model="editBiome.color" id="color-new" name="color-new" required />
						</div>
						<div class="flex flex-col items-center">
							<label for="name-new" class="mb-1 text-xs text-slate-700 dark:text-slate-300">Name</label>
							<input
								type="text"
								v-model="editBiome.name"
								id="name-new"
								name="name-new"
								placeholder="Name..."
								required
							/>
						</div>
					</div>
					<div class="flex flex-row justify-center gap-2">
						<div class="flex flex-col items-center">
							<label for="x1-new" class="mb-1 text-xs text-slate-700 dark:text-slate-300"
								>Point 1, X</label
							>
							<input
								type="number"
								v-model.number="editBiome.coordinates[0].x"
								id="x1-new"
								name="x1-new"
								placeholder="X1..."
								min="-1"
								max="1"
								step="0.1"
								required
							/>
						</div>
						<div class="flex flex-col items-center">
							<label for="x1-new" class="mb-1 text-xs text-slate-700 dark:text-slate-300"
								>Point 1, Y</label
							>
							<input
								type="number"
								v-model.number="editBiome.coordinates[0].y"
								id="y1-new"
								name="y1-new"
								placeholder="Y1..."
								min="-1"
								max="1"
								step="0.1"
								required
							/>
						</div>
					</div>
					<div class="flex flex-row justify-center gap-2">
						<div class="flex flex-col items-center">
							<label for="x1-new" class="mb-1 text-xs text-slate-700 dark:text-slate-300"
								>Point 2, X</label
							>
							<input
								type="number"
								v-model.number="editBiome.coordinates[1].x"
								id="x2-new"
								name="x2-new"
								placeholder="X2..."
								min="-1"
								max="1"
								step="0.1"
								required
							/>
						</div>
						<div class="flex flex-col items-center">
							<label for="x1-new" class="mb-1 text-xs text-slate-700 dark:text-slate-300"
								>Point 2, Y</label
							>
							<input
								type="number"
								v-model.number="editBiome.coordinates[1].y"
								id="y2-new"
								name="y2-new"
								placeholder="Y2..."
								min="-1"
								max="1"
								step="0.1"
								required
							/>
						</div>
					</div>
				</div>
				<Button>Save</Button>
			</form>
		</Modal>
	</Teleport>
	<main class="layout bg-slate-100 dark:bg-slate-600 text-slate-900 dark:text-slate-100 overflow-y-hidden">
		<div class="flex fixed bottom-4 left-4 z-60">
			<p class="text-slate-700 dark:text-slate-300 text-xs">
				<a
					class="underline font-semibold hover:no-underline"
					href="https://gitlab.com/ekkaia/gridmap-playground"
					>Freely accessible on GitLab</a
				>
				under the Apache 2.0 Licence
			</p>
		</div>
		<div class="flex fixed top-4 left-4 z-60">
			<Button class="flex flex-row gap-2 py-2 px-4" @click="downloadMapJSON">
				<span>Save map as JSON</span>
				<img src="./assets/download.svg" alt="Download" width="18" height="18" />
			</Button>
		</div>
		<section class="content">
			<div class="flex justify-center items-center h-full w-full">
				<canvas id="map" class="bg-slate-900 <md:h-full"></canvas>
			</div>
		</section>
		<section
			:class="['sidebar bg-slate-400 dark:bg-slate-800 py-8 h-full relative', { 'hide-sidebar': isSidebarOpen }]"
		>
			<div class="absolute -left-12 top-10 <md:-left-8">
				<button @click="isSidebarOpen = !isSidebarOpen" :class="{ 'menu-rotate': isSidebarOpen }">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						:stroke="isDarkMode ? '#f5f5f4' : '#1c1917'"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
					</svg>
				</button>
			</div>
			<div class="flex flex-col h-full justify-between gap-2">
				<div class="overflow-y-auto px-8">
					<div class="mb-8">
						<h1 class="text-center text-3xl font-bold">Gridmap Playground</h1>
					</div>
					<div class="mb-6">
						<div class="bg-slate-300 dark:bg-slate-700 rounded-xl p-4 flex flex-col gap-4">
							<h2 class="text-lg font-semibold text-center">Config</h2>
							<details class="flex flex-col bg-slate-200 dark:bg-slate-600 rounded-xl p-4" open>
								<summary class="flex flex-row justify-between items-center cursor-pointer select-none">
									<h2 class="text-lg font-semibold">Height map</h2>
									<svg
										class="arrow-summary"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										:stroke="isDarkMode ? '#f5f5f4' : '#1c1917'"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								</summary>
								<div class="grid grid-cols-3 grid-rows-2 gap-2 mt-2 justify-center">
									<div class="flex flex-col items-center gap-1">
										<label for="width">Width</label>
										<input
											type="number"
											v-model.lazy="heightMapConfig.width"
											id="width"
											min="0"
											max="1024"
											placeholder="0..."
											name="width"
											required
										/>
									</div>
									<div class="flex flex-col items-center gap-1">
										<label for="height">Height</label>
										<input
											type="number"
											v-model.lazy="heightMapConfig.height"
											id="height"
											min="0"
											max="1024"
											placeholder="0..."
											name="height"
											required
										/>
									</div>
									<div class="flex flex-col items-center gap-1">
										<label for="frequency">Freq.</label>
										<input
											type="number"
											v-model.lazy="heightMapConfig.frequency"
											id="frequency"
											min="0"
											max="1024"
											placeholder="0..."
											name="frequency"
											required
										/>
									</div>
									<div class="flex flex-col items-center gap-1">
										<label for="tilesize">Tilesize</label>
										<input
											type="number"
											v-model.lazy="heightMapConfig.tilesize"
											id="tilesize"
											min="0"
											max="1024"
											placeholder="0..."
											name="tilesize"
											required
										/>
									</div>
									<div class="flex flex-col items-center gap-1">
										<label for="gap">Gap</label>
										<input
											type="number"
											v-model.lazy="heightMapConfig.gap"
											id="gap"
											min="0"
											max="1024"
											placeholder="0..."
											name="gap"
											required
										/>
									</div>
									<div class="flex flex-col items-center gap-1">
										<label for="gap">Octaves</label>
										<input
											type="number"
											v-model.lazy="heightMapConfig.octaves"
											id="octaves"
											min="0"
											max="1024"
											placeholder="0..."
											name="octaves"
											required
										/>
									</div>
								</div>
							</details>
							<details class="flex flex-col bg-slate-200 dark:bg-slate-600 rounded-xl p-4" open>
								<summary class="flex flex-row justify-between items-center cursor-pointer select-none">
									<h2 class="text-lg font-semibold">Moisture map</h2>
									<svg
										class="arrow-summary"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										:stroke="isDarkMode ? '#f5f5f4' : '#1c1917'"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								</summary>
								<div class="grid grid-cols-2 grid-rows-1 gap-2 mt-2 justify-center">
									<div class="flex flex-col items-center gap-1">
										<label for="frequency">Freq.</label>
										<input
											type="number"
											v-model.lazy="moistureMapConfig.frequency"
											id="frequency"
											min="0"
											max="1024"
											placeholder="0..."
											name="frequency"
											required
										/>
									</div>
									<div class="flex flex-col items-center gap-1">
										<label for="gap">Octaves</label>
										<input
											type="number"
											v-model.lazy="moistureMapConfig.octaves"
											id="octaves"
											min="0"
											max="1024"
											placeholder="0..."
											name="octaves"
											required
										/>
									</div>
								</div>
							</details>
							<Button @click="generate">Create new map</Button>
						</div>
					</div>
					<div class="mb-6">
						<details class="bg-slate-300 dark:bg-slate-700 rounded-xl p-4" open>
							<summary class="flex flex-row justify-between items-center cursor-pointer select-none">
								<h2 class="text-lg font-semibold">Biomes</h2>
								<svg
									class="arrow-summary"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									:stroke="isDarkMode ? '#f5f5f4' : '#1c1917'"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</summary>
							<div class="flex flex-col gap-4 mt-2 mb-6">
								<div>
									<p class="text-sm text-slate-600 dark:text-slate-300">
										Simplex noise output values are between -1 and 1. The abscissa (X-axis) is the
										moisture, the ordinate (Y-axis) the height.
									</p>
								</div>
								<div class="flex flex-row gap-2">
									<input
										type="file"
										id="upload-settings"
										@change="uploadSettings"
										class="hidden"
										accept=".json"
									/>
									<Button class="flex flex-row gap-2" @click="triggerInputFile">
										<span class="text-xs">Upload settings</span>
										<img src="./assets/upload.svg" alt="Upload" width="18" height="18" />
									</Button>
									<Button class="flex flex-row gap-2" @click="saveSettings">
										<span class="text-xs">Download settings</span>
										<img src="./assets/download.svg" alt="Download" width="18" height="18" />
									</Button>
								</div>
								<div class="flex flex-col items-center justify-center gap-4 mt-2 mb-6 relative">
									<canvas id="biome-map" class="rounded-md w-3/4 h-3/4"></canvas>
									<span class="absolute top-0 left-5 text-sm font-semibold">1</span>
									<span class="absolute top-5/11 left-5 text-sm font-semibold">0</span>
									<span class="absolute bottom-0 left-5 text-sm font-semibold">-1</span>
									<span class="absolute -bottom-8 left-12 text-sm font-semibold">-1</span>
									<span class="absolute -bottom-8 left-1/2 text-sm font-semibold">0</span>
									<span class="absolute -bottom-8 right-12 text-sm font-semibold">1</span>
								</div>
								<div class="flex flex-col gap-2">
									<div
										class="grid grid-cols-[1fr,0.5fr,1fr,1fr,0.5fr,0.5fr] gap-4 text-slate-600 dark:text-slate-300 text-xs"
									>
										<p class="text-center">Name</p>
										<p>Color</p>
										<p class="text-center">X1, Y1</p>
										<p>X2, Y2</p>
									</div>
									<draggable class="flex flex-col gap-2" :list="biomes">
										<TransitionGroup name="list">
											<div
												v-for="(biome, i) in biomes"
												:key="biome.id"
												class="rounded-xl bg-slate-200 dark:bg-slate-600 py-2 px-3 cursor-move"
											>
												<div
													class="grid grid-cols-[1fr,0.5fr,1fr,1fr,0.5fr,0.5fr] gap-2 items-center"
												>
													<div>
														<h3 class="text-md font-semibold">{{ biome.name }}</h3>
													</div>
													<div>
														<span
															class="flex w-6 h-6 rounded-lg border-slate-300 dark:border-slate-400 border-2"
															:style="`background:${biome.color}`"
														></span>
													</div>
													<div>
														<p class="font-mono text-xs">
															({{ biome.coordinates[0].x }}, {{ biome.coordinates[0].y }})
														</p>
													</div>
													<div>
														<p class="font-mono text-xs">
															({{ biome.coordinates[1].x }}, {{ biome.coordinates[1].y }})
														</p>
													</div>
													<div>
														<Button class="h-10 w-9 mb-1" @click="openModal(i)">
															<img src="./assets/edit.svg" alt="Edit" />
														</Button>
													</div>
													<div>
														<Button class="h-10 w-9 mb-1" @click="removeRange(i)">
															<img src="./assets/trash.svg" alt="Trash" />
														</Button>
													</div>
												</div>
											</div>
										</TransitionGroup>
									</draggable>
								</div>
								<div>
									<Button @click="openModal(-1)" class="gap-2">
										<span>Add new biome</span>
										<img src="./assets/plus.svg" alt="Plus" />
									</Button>
								</div>
							</div>
						</details>
					</div>
					<div class="mb-6">
						<details class="bg-slate-300 dark:bg-slate-700 rounded-xl p-4">
							<summary class="flex flex-row justify-between items-center cursor-pointer select-none">
								<h2 class="text-lg font-semibold">Raw height map</h2>
								<svg
									class="arrow-summary"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									:stroke="isDarkMode ? '#f5f5f4' : '#1c1917'"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</summary>
							<div class="flex flex-col items-center justify-center gap-4 mt-2 mb-6">
								<canvas id="raw-height-map" class="rounded-md w-full h-full"></canvas>
							</div>
						</details>
					</div>
					<div class="mb-6">
						<details class="bg-slate-300 dark:bg-slate-700 rounded-xl p-4">
							<summary class="flex flex-row justify-between items-center cursor-pointer select-none">
								<h2 class="text-lg font-semibold">Raw moisture map</h2>
								<svg
									class="arrow-summary"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									:stroke="isDarkMode ? '#f5f5f4' : '#1c1917'"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</summary>
							<div class="flex flex-col items-center justify-center gap-4 mt-2 mb-6">
								<canvas id="raw-moisture-map" class="rounded-md w-full h-full"></canvas>
							</div>
						</details>
					</div>
				</div>
				<div class="flex flex-row gap-x-2 justify-between pt-4 px-8">
					<button @click="changeTheme">
						<img src="./assets/dark.svg" alt="Dark mode" v-if="isDarkMode" />
						<img src="./assets/light.svg" alt="Light mode" v-else />
					</button>
					<p class="dark:text-slate-400 text-slate-500">
						Made with ❤️ by <span class="font-semibold">Ekkaia</span>
					</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import Button from "./components/Button.vue";
import Modal from "./components/Modal.vue";
import { VueDraggableNext as draggable } from "vue-draggable-next";

import GridMapGenerator from "./services/gridmap";
import type { Biome, Config, ConfigLight } from "./services/interfaces";
import { saveAs } from "file-saver";
import "normalize.css";

const biomes = reactive<Biome[]>([
	{
		coordinates: [
			{
				x: -1,
				y: -1,
			},
			{
				x: 1,
				y: 0,
			},
		],
		color: "#4f64c9",
		name: "water",
		id: 0,
	},
	{
		name: "deep water",
		color: "#4c5aa4",
		coordinates: [
			{
				x: 0,
				y: -1,
			},
			{
				x: 0.5,
				y: -0.5,
			},
		],
		id: 5,
	},
	{
		coordinates: [
			{
				x: -1,
				y: 0,
			},
			{
				x: 1,
				y: 0.1,
			},
		],
		color: "#f8d796",
		name: "beach",
		id: 1,
	},
	{
		coordinates: [
			{
				x: -1,
				y: 0.1,
			},
			{
				x: 1,
				y: 0.5,
			},
		],
		color: "#61a84d",
		name: "plain",
		id: 2,
	},
	{
		coordinates: [
			{
				x: 0,
				y: 0.2,
			},
			{
				x: 1,
				y: 0.5,
			},
		],
		color: "#3b8632",
		name: "forest",
		id: 3,
	},
	{
		coordinates: [
			{
				x: -1,
				y: 0.5,
			},
			{
				x: 1,
				y: 1,
			},
		],
		color: "#533e1a",
		name: "moutain",
		id: 4,
	},
	{
		name: "ice sea",
		color: "#a8a8fd",
		coordinates: [
			{
				x: 0.5,
				y: -1,
			},
			{
				x: 1,
				y: -0.5,
			},
		],
		id: 6,
	},
	{
		name: "shore",
		color: "#3b55bc",
		coordinates: [
			{
				x: -1,
				y: -0.1,
			},
			{
				x: 1,
				y: 0,
			},
		],
		id: 7,
	},
	{
		name: "rock",
		color: "#70706e",
		coordinates: [
			{
				x: -1,
				y: 0.6,
			},
			{
				x: 1,
				y: 1,
			},
		],
		id: 8,
	},
	{
		name: "snow",
		color: "#e2e1de",
		coordinates: [
			{
				x: -1,
				y: 0.8,
			},
			{
				x: 1,
				y: 1,
			},
		],
		id: 9,
	},
	{
		name: "savana",
		color: "#98cb2a",
		coordinates: [
			{
				x: -1,
				y: 0.3,
			},
			{
				x: -0.3,
				y: 0.5,
			},
		],
		id: 10,
	},
]);
const isDarkMode = ref<boolean | undefined>(undefined);
const heightMapConfig = reactive<Config>({ width: 250, height: 250, frequency: 3, tilesize: 3, gap: 0, octaves: 8 });
const moistureMapConfig = reactive<ConfigLight>({ frequency: 3, octaves: 8 });
const gridMapGenerator = new GridMapGenerator(heightMapConfig, moistureMapConfig, biomes);
const editBiome = ref<Omit<Biome, "id">>({
	name: "",
	color: "#000000",
	coordinates: [
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
	],
});
const selectedBiomeIndex = ref<number | undefined>(undefined);
const isSidebarOpen = ref<boolean>(false);

onMounted(() => {
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		document.documentElement.classList.add("dark");
		isDarkMode.value = true;
	} else {
		document.documentElement.classList.add("light");
		isDarkMode.value = false;
	}
	gridMapGenerator.draw(true);
	gridMapGenerator.drawColorRanges();
});

function changeTheme(): void {
	document.documentElement.classList.toggle("dark");
	isDarkMode.value = !isDarkMode.value;
}

function generate(): void {
	gridMapGenerator.draw(true);
}

function removeRange(i: number): void {
	biomes.splice(i, 1);
}

function openModal(i: number): void {
	if (i !== -1) {
		selectedBiomeIndex.value = i;
		editBiome.value = {
			name: biomes[i].name,
			color: biomes[i].color,
			coordinates: [
				{ x: biomes[i].coordinates[0].x, y: biomes[i].coordinates[0].y },
				{ x: biomes[i].coordinates[1].x, y: biomes[i].coordinates[1].y },
			],
		};
	} else {
		selectedBiomeIndex.value = undefined;
		editBiome.value = {
			name: "",
			color: "#000000",
			coordinates: [
				{ x: 0, y: 0 },
				{ x: 0, y: 0 },
			],
		};
	}
	const dialog = document.querySelector("dialog");
	dialog?.showModal();
}

function closeModal(): void {
	const dialog = document.querySelector("dialog");
	dialog?.close();
}

function changeBiome(): void {
	console.log(selectedBiomeIndex.value);
	if (selectedBiomeIndex.value !== undefined) {
		biomes[selectedBiomeIndex.value].name = editBiome.value.name;
		biomes[selectedBiomeIndex.value].color = editBiome.value.color;
		biomes[selectedBiomeIndex.value].coordinates = editBiome.value.coordinates;
		selectedBiomeIndex.value = undefined;
	} else {
		biomes.push({
			...editBiome.value,
			id: Math.max(...biomes.map((c) => c.id)) + 1,
		});
	}
	closeModal();
}

function saveSettings(): void {
	const blob = new Blob([JSON.stringify(biomes)], { type: "application/json;charset=utf-8" });
	const event = new Date();
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};
	const date = event.toLocaleString("en", options);
	saveAs(blob, `gridmap-playground-settings-${date}.json`);
}

function triggerInputFile(): void {
	document.getElementById("upload-settings")?.click();
}

function uploadSettings(): void {
	const inputFile = document.querySelector("input[type=file]") as HTMLInputElement;
	const file = inputFile.files?.[0];
	if (file) {
		const reader = new FileReader();
		reader.addEventListener("load", (event) => {
			biomes.splice(0, biomes.length, ...JSON.parse(event.target?.result as string));
		});
		reader.readAsText(file);
	}
}

function downloadMapJSON(): void {
	const blob = new Blob([JSON.stringify(gridMapGenerator.coloredMap)], { type: "application/json;charset=utf-8" });
	const event = new Date();
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};
	const date = event.toLocaleString("en", options);
	saveAs(blob, `gridmap-playground-map-${date}.json`);
}

watch(heightMapConfig, () => {
	gridMapGenerator.setHeightMapConfig(heightMapConfig);
	gridMapGenerator.draw(false);
});

watch(moistureMapConfig, () => {
	gridMapGenerator.setMoistureMapConfig(moistureMapConfig);
	gridMapGenerator.draw(false);
});

watch(biomes, () => {
	gridMapGenerator.setColorRanges(biomes);
	gridMapGenerator.drawColorRanges();
	gridMapGenerator.draw(false);
});
</script>

<style lang="scss" scoped>
main {
	overflow-x: hidden;
}

.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.list-leave-active {
	position: absolute;
}

.dark {
	.layout {
		.sidebar,
		dialog {
			box-shadow: -0.5px 0px 0.6px hsl(0deg 0% 0% / 0.2), -1.2px 0px 1.3px -0.6px hsl(0deg 0% 0% / 0.2),
				-2.3px 0px 2.6px -1.2px hsl(0deg 0% 0% / 0.2), -4.5px 0px 5.1px -1.9px hsl(0deg 0% 0% / 0.2),
				-8.6px 0.1px 9.7px -2.5px hsl(0deg 0% 0% / 0.2);
		}
	}
}

.layout {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	height: 100vh;

	.content {
		width: calc(100% - 28rem);
		height: 100%;
	}

	.sidebar,
	dialog {
		box-shadow: -0.5px 0px 0.6px hsl(0deg 0% 73% / 0.2), -1.2px 0px 1.3px -0.6px hsl(0deg 0% 73% / 0.2),
			-2.3px 0px 2.6px -1.2px hsl(0deg 0% 73% / 0.2), -4.5px 0px 5.1px -1.9px hsl(0deg 0% 73% / 0.2),
			-8.6px 0.1px 9.7px -2.5px hsl(0deg 0% 73% / 0.2);
	}

	.sidebar {
		margin-left: auto;
		max-width: 90%;
		flex-basis: 28rem;
		flex-grow: 1;
		z-index: 998;
		border-radius: 1rem 0 0 1rem;
		animation: show 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;

		&.hide-sidebar {
			animation: hide 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
		}
	}

	.menu-rotate {
		transform: rotate(180deg);
		animation: transform 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
	}
}

@keyframes hide {
	0% {
		transform: translateX(0);
	}

	100% {
		transform: translateX(100%);
	}
}

@keyframes show {
	0% {
		transform: translateX(28rem);
	}

	100% {
		transform: translateX(0);
	}
}

details .arrow-summary {
	transition: all 0.2s ease-in-out;
	transform: rotate(-90deg);
}

details[open] .arrow-summary {
	transition: all 0.2s ease-in-out;
	transform: rotate(0deg);
}

input {
	@apply rounded-lg text-slate-900 py-1 px-3 bg-slate-50 dark: bg-slate-300 placeholder-slate-500 h-10 w-full;

	&[type="color"] {
		@apply p-1;
	}

	&:focus {
		@apply outline-none ring-2 ring-slate-300;
	}

	&:disabled {
		@apply text-slate-700 bg-slate-400 dark: bg-slate-400 select-none cursor-not-allowed;
	}
}

label {
	@apply text-xs text-slate-800 dark: text-slate-300;
}
</style>
