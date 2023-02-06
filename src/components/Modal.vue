<template>
	<Transition name="slide-fade">
		<dialog class="fixed m-0 top-4 left-4 bg-stone-200 dark:bg-stone-800 rounded-2xl text-stone-900 dark:text-stone-300">
			<slot />
		</dialog>
	</Transition>
</template>

<style lang="scss" scoped>
dialog  {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	&::backdrop {
		background: rgba(0, 0, 0, 0.75);
	}
}

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
