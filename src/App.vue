<template>
	<main class="layout bg-stone-100 dark:bg-stone-600 text-stone-900 dark:text-stone-100 overflow-y-hidden">
		<div class="flex fixed bottom-4 left-4 z-60">
			<p class="text-stone-700 dark:text-stone-300 text-xs">
				<a class="underline font-semibold hover:no-underline" href="">Freely accessible on GitLab</a> under the Apache 2.0 Licence
			</p>
		</div>
		<section class="content">
			<div class="flex justify-center items-center h-full">
				<canvas id="map"></canvas>
			</div>
		</section>
		<section class="sidebar bg-stone-200 dark:bg-stone-800 py-8 h-full">
			<div class="flex flex-col h-full justify-between gap-2">
				<div class="overflow-y-auto px-8">
					<div class="mb-8">
						<h1 class="text-center text-3xl font-bold">Gridmap Playground</h1>
					</div>
					<div class="mb-6">
						<div class="bg-stone-300 dark:bg-stone-700 rounded-xl p-4 flex flex-col gap-4">
							<h2 class="text-lg font-semibold text-center">Config</h2>
							<div class="grid grid-cols-3 grid-rows-2 gap-2 justify-center">
								<div class="flex flex-col items-center gap-1">
									<label
										for="width"
										class="text-xs text-stone-700 dark:text-stone-300"
									>Width</label>
									<input
										class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
										type="number"
										v-model.lazy="config.width"
										id="width"
										min="0"
										max="1024"
										placeholder="0..."
										name="width"
										required
									/>
								</div>
								<div class="flex flex-col items-center gap-1">
									<label
										for="height"
										class="text-xs text-stone-700 dark:text-stone-300"
									>Height</label>
									<input
										class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
										type="number"
										v-model.lazy="config.height"
										id="height"
										min="0"
										max="1024"
										placeholder="0..."
										name="height"
										required
									/>
								</div>
								<div class="flex flex-col items-center gap-1">
									<label
										for="frequency"
										class="text-xs text-stone-700 dark:text-stone-300"
									>Freq.</label>
									<input
										class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
										type="number"
										v-model.lazy="config.frequency"
										id="frequency"
										min="0"
										max="1024"
										placeholder="0..."
										name="frequency"
										required
									/>
								</div>
								<div class="flex flex-col items-center gap-1">
									<label
										for="tilesize"
										class="text-xs text-stone-700 dark:text-stone-300"
									>Tilesize</label>
									<input
										class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
										type="number"
										v-model.lazy="config.tilesize"
										id="tilesize"
										min="0"
										max="1024"
										placeholder="0..."
										name="tilesize"
										required
									/>
								</div>
								<div class="flex flex-col items-center gap-1">
									<label
										for="gap"
										class="text-xs text-stone-700 dark:text-stone-300"
									>Gap</label>
									<input
										class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
										type="number"
										v-model.lazy="config.gap"
										id="gap"
										min="0"
										max="1024"
										placeholder="0..."
										name="gap"
										required
									/>
								</div>
								<div class="flex flex-col items-center gap-1">
									<label
										for="gap"
										class="text-xs text-stone-700 dark:text-stone-300"
									>Octaves</label>
									<input
										class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
										type="number"
										v-model.lazy="config.octaves"
										id="octaves"
										min="0"
										max="1024"
										placeholder="0..."
										name="octaves"
										required
									/>
								</div>
							</div>
							<Button @click="generate">Create new map</Button>
						</div>
					</div>
					<div class="mb-6">
						<details class="bg-stone-300 dark:bg-stone-700 rounded-xl p-4" open>
							<summary class="flex flex-row justify-between items-center cursor-pointer">
								<h2 class="text-lg font-semibold">Ranges</h2>
								<svg class="arrow-summary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" :stroke="isDarkMode ? '#f5f5f4' : '#1c1917'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
							</summary>
							<div class="flex flex-col gap-4 mt-2 mb-6">
								<div>
									<p class="text-sm text-stone-200">Simplex noise output values are between -1 and 1.</p>
								</div>
								<div v-for="(colorRangeValue, i) in colorRangeValues.sort((a, b) => a.min - b.min)" :key="colorRangeValue.name" class="grid grid-flow-col-dense grid-rows-1 gap-2 items-start">
									<div class="flex flex-col items-center">
										<label
											:for="`color-${i}`"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Color</label>
										<input
											class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
											type="color"
											v-model.lazy="colorRangeValue.color"
											:id="`color-${i}`"
											:name="`color-${i}`"
											required
										/>
									</div>
									<div class="flex flex-col items-center">
										<label
											:for="`name-${i}`"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Name</label>
										<input
											class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 w-full"
											type="text"
											v-model.lazy="colorRangeValue.name"
											:id="`name-${i}`"
											:name="`name-${i}`"
											placeholder="Name..."
											required
										/>
									</div>
									<div class="flex flex-col items-center">
										<label
											:for="`min-${i}`"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Min</label>
										<input
											class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 w-full"
											type="number"
											v-model.lazy="colorRangeValue.min"
											:id="`min-${i}`"
											:name="`min-${i}`"
											placeholder="Min..."
											min="-1"
											max="1"
											step="0.1"
											required
										/>
									</div>
									<div class="flex flex-col items-center">
										<label
											:for="`max-${i}`"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Max</label>
										<input
											class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 w-full"
											type="number"
											v-model.lazy="colorRangeValue.max"
											:id="`max-${i}`"
											:name="`max-${i}`"
											placeholder="Max..."
											min="-1"
											max="1"
											step="0.1"
											required
										/>
									</div>
									<div class="flex items-end h-16">
										<Button class="h-10 w-9" @click="removeRange(i)">
											<img src="./assets/trash.svg" alt="Trash" />
										</Button>
									</div>
								</div>
							</div>
							<form class="flex flex-col gap-4 bg-stone-400 dark:bg-stone-600 rounded-xl p-2" @submit.prevent="addNewRange">
								<div class="grid grid-flow-col-dense grid-rows-1 gap-2">
									<div class="flex flex-col items-center">
										<label
											for="color-new"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Color</label>
										<input
											class="rounded-lg text-stone-900 p-1 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 h-10 w-full"
											type="color"
											v-model="newColorRange.color"
											id="color-new"
											name="color-new"
											required
										/>
									</div>
									<div class="flex flex-col items-center max-w-26">
										<label
											for="name-new"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Name</label>
										<input
											class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 w-full"
											type="text"
											v-model="newColorRange.name"
											id="name-new"
											name="name-new"
											placeholder="Name..."
											required
										/>
									</div>
									<div class="flex flex-col items-center max-w-16">
										<label
											for="min-new"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Min</label>
										<input
											class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 w-full"
											type="number"
											v-model.number="newColorRange.min"
											id="min-new"
											name="min-new"
											placeholder="Min..."
											min="-1"
											max="1"
											step="0.1"
											required
										/>
									</div>
									<div class="flex flex-col items-center max-w-16">
										<label
											for="max-new"
											class="mb-1 text-xs text-stone-700 dark:text-stone-300"
										>Max</label>
										<input
											class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500 w-full"
											type="number"
											v-model.number="newColorRange.max"
											id="max-new"
											name="max-new"
											placeholder="Max..."
											min="-1"
											max="1"
											step="0.1"
											required
										/>
									</div>
								</div>
								<Button>Add new range</Button>
							</form>
						</details>
					</div>
					<div class="mb-6">
						<details class="bg-stone-300 dark:bg-stone-700 rounded-xl p-4" open>
							<summary class="flex flex-row justify-between items-center cursor-pointer">
								<h2 class="text-lg font-semibold">Raw map</h2>
								<svg class="arrow-summary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" :stroke="isDarkMode ? '#f5f5f4' : '#1c1917'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
							</summary>
							<div class="flex flex-col items-center justify-center gap-4 mt-2 mb-6">
								<canvas id="raw-map" class="rounded-md w-full h-full"></canvas>
							</div>
						</details>
					</div>
				</div>
				<div class="flex flex-row gap-x-2 justify-between pt-4 px-8">
					<button @click="changeTheme">
						<img src="./assets/dark.svg" alt="Dark mode" v-if="isDarkMode" />
						<img src="./assets/light.svg" alt="Light mode" v-else />
					</button>
					<p class="text-stone-400">
						Made with ❤️ by <span class="font-semibold">Ekkaia</span>
					</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import Button from "./components/Button.vue";

import GridMapGenerator from "./services/gridmap";
import type { ColorRange, Config } from "./services/interfaces";
import "normalize.css";

const colorRangeValues = reactive<ColorRange[]>([
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
		color: "#367E18",
		name: "grass",
	},
	{
		min: 0.5,
		max: 1,
		color: "#473C33",
		name: "rock",
	},
]);
const isDarkMode = ref<boolean | undefined>(undefined);
const config = reactive<Config>({ width: 96, height: 96, frequency: 2, tilesize: 8, gap: 1, octaves: 3 });
const newColorRange = ref<ColorRange>({
	name: "",
	color: "#000000",
	min: 0,
	max: 0,
});
const gridMapGenerator = new GridMapGenerator(config, colorRangeValues);

onMounted(() => {
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		document.documentElement.classList.add("dark");
		isDarkMode.value = true;
	} else {
		document.documentElement.classList.add("light");
		isDarkMode.value = false;
	}
	gridMapGenerator.draw(true);
});

function changeTheme(): void {
	document.documentElement.classList.toggle("dark");
	isDarkMode.value = !isDarkMode.value;
}

function generate(): void {
	gridMapGenerator.draw(true);
}

function addNewRange(): void {
	colorRangeValues.push(newColorRange.value);
	newColorRange.value = {
		name: "",
		color: "#000000",
		min: 0,
		max: 0,
	};
}

function removeRange(i: number): void {
	colorRangeValues.splice(i, 1);
}

watch(config, () => {
	gridMapGenerator.setConfig(config);
	gridMapGenerator.draw(false);
});

watch(colorRangeValues, () => {
	gridMapGenerator.setColorRanges(colorRangeValues);
	gridMapGenerator.draw(false);
});
</script>

<style lang="scss" scoped>
.dark {
	.layout {
		.sidebar,
		dialog {
			box-shadow: -0.5px 0px 0.6px hsl(0deg 0% 0% / 0.2),
				-1.2px 0px 1.3px -0.6px hsl(0deg 0% 0% / 0.2),
				-2.3px 0px 2.6px -1.2px hsl(0deg 0% 0% / 0.2),
				-4.5px 0px 5.1px -1.9px hsl(0deg 0% 0% / 0.2),
				-8.6px 0.1px 9.7px -2.5px hsl(0deg 0% 0% / 0.2);
		}
	}
}

.layout {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	height: 100vh;

	.content {
		flex-basis: 0;
		flex-grow: 999;
		min-width: 50%;
		height: 100%;
	}

	.sidebar,
	dialog {
		box-shadow: -0.5px 0px 0.6px hsl(0deg 0% 73% / 0.2),
			-1.2px 0px 1.3px -0.6px hsl(0deg 0% 73% / 0.2),
			-2.3px 0px 2.6px -1.2px hsl(0deg 0% 73% / 0.2),
			-4.5px 0px 5.1px -1.9px hsl(0deg 0% 73% / 0.2),
			-8.6px 0.1px 9.7px -2.5px hsl(0deg 0% 73% / 0.2);
	}

	.sidebar {
		flex-basis: 25rem;
		flex-grow: 1;
		z-index: 998;
		border-radius: 1rem 0 0 1rem;
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
</style>
