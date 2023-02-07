<template>
	<Transition name="slide-fade">
		<dialog
			class="fixed m-0 top-4 left-4 bg-slate-200 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-slate-300"
		>
			<div class="flex justify-end mb-4">
				<div>
					<Button @click="close">
						<img src="@/assets/close.svg" alt="Close" />
					</Button>
				</div>
			</div>
			<slot />
		</dialog>
	</Transition>
</template>

<script lang="ts" setup>
import Button from "./Button.vue";

const emit = defineEmits(["close"]);

function close() {
	emit("close");
}
</script>

<style lang="scss" scoped>
dialog {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	&::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}
}

dialog[open] {
	animation: show 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes show {
	from {
		opacity: 0;
		transform: translate(-50%, 0%);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%);
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
