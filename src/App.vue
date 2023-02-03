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
		<section class="sidebar bg-stone-200 dark:bg-stone-800 p-8 h-full">
			<div class="flex flex-col h-full overflow-y-scroll">
				<div>
					<div class="mb-8">
						<h1 class="text-center text-3xl font-bold">Gridmap Playground</h1>
					</div>
					<div class="mb-6">
						<div class="bg-stone-300 dark:bg-stone-700 rounded-xl p-4">
							<h2 class="mb-2 text-lg font-semibold text-center">Config</h2>
							<div class="flex flex-row gap-2 justify-center">
								<div class="flex flex-col mb-4">
									<label
										for="width"
										class="mb-1 text-sm text-stone-700 dark:text-stone-300"
									>Width</label>
									<input
										class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500"
										type="number"
										v-model.number="config.width"
										id="width"
										min="0"
										max="1024"
										placeholder="0..."
										name="width"
										required
									/>
								</div>
								<div class="flex flex-col mb-4">
									<label
										for="height"
										class="mb-1 text-sm text-stone-700 dark:text-stone-300"
									>Height</label>
									<input
										class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500"
										type="number"
										v-model.number="config.height"
										id="height"
										min="0"
										max="1024"
										placeholder="0..."
										name="height"
										required
									/>
								</div>
							</div>
							<Button
								@click="init(config.width, config.height)"
							>Create new map</Button>
						</div>
					</div>
					<div class="mb-6">
						<!--<div class="bg-stone-300 dark:bg-stone-700 rounded-xl p-4">
							<h2 class="mb-2 text-lg font-semibold text-center">Place</h2>
							<form @submit.prevent="addPlace">
								<div class="flex flex-col mb-4">
									<label for="place-name"
										class="mb-1 text-sm text-stone-700 dark:text-stone-300">Name</label>
									<input
										class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500"
										type="text" v-model="place.name" id="place-name" minlength="1"
										placeholder="Name..." name="place-name" required />
								</div>
								<div class="flex flex-col mb-4">
									<label for="place-tokens"
										class="mb-1 text-sm text-stone-700 dark:text-stone-300">Tokens</label>
									<input
										class="rounded-lg text-stone-900 p-2 bg-stone-100 dark:bg-stone-300 placeholder-stone-500"
										type="number" v-model.number="place.tokens" name="place-tokens"
										id="place-tokens" step="1" min="0" required />
								</div>
								<div>
									<Button type="submit">
										<img src="./assets/plus-light.svg" alt="Plus light icon" />
										<span class="ml-1">Add</span>
									</Button>
								</div>
							</form>
						</div>-->
					</div>
				</div>
				<div class="flex flex-row gap-x-2 justify-between">
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
	<!--<main>
		<div class="btn">
			<button @click="init(64, 64, 8)">New map</button>
		</div>
		<div class="canvas">
			<canvas id="map"></canvas>
			<div>
				<div>
					<canvas id="raw-map"></canvas>
				</div>
				<div class="flex flex-col gap-4">
					<div v-for="colorRange in colorRangeValues" :key="colorRange.name">
						<div class="flex flex-col gap-1">
							<label :for="colorRange.name">Name:</label>
							<input
								type="text"
								name="name"
								id="name"
								class="p-1 rounded-md bg-stone-700 bg-opacity-50"
								v-model="colorRange.name"
							/>
						</div>
						<div class="flex flex-col gap-1">
							<label :for="colorRange.name">Color:</label>
							<input
								type="color"
								name="color"
								id="color"
								class="p-1 rounded-md bg-stone-700 bg-opacity-50"
								v-model="colorRange.color"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>-->
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import Button from "./components/Button.vue";

import { init } from "./services/gridmap";
import type { ColorRange, Config } from "./services/interfaces";
import { colorRanges } from "./services/gridmap";

const colorRangeValues = ref<ColorRange[]>(colorRanges);
const isDarkMode = ref<boolean | undefined>(undefined);
const config = reactive<Config>({ width: 64, height: 64 });

onMounted(() => {
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		document.documentElement.classList.add("dark");
		isDarkMode.value = true;
	} else {
		document.documentElement.classList.add("light");
		isDarkMode.value = false;
	}
	init(config.width, config.height);
});

function changeTheme(): void {
	document.documentElement.classList.toggle("dark");
	isDarkMode.value = !isDarkMode.value;
}
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
}
</style>
