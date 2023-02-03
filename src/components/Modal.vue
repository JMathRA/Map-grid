<template>
	<Transition name="slide-fade">
		<dialog
            v-if="open"
			open
			class="fixed m-0 top-4 left-4 bg-stone-200 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-stone-300"
		>
			<p>
				{{ text }}<span class="ml-2">{{ !isError ? "✅" : "❌" }}</span>
			</p>
		</dialog>
	</Transition>
</template>

<script setup lang="ts">
defineProps<{
	open: boolean;
	text: string;
	isError: boolean;
}>();
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
	transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(-20px);
	opacity: 0;
}
</style>
