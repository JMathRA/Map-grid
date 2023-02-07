<template>
	<button
		class="flex flex-row justify-center items-center shadow-md text-slate-100 dark:text-slate-100 w-full rounded-md font-semibold py-1 px-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 select-none"
	>
		<slot></slot>
	</button>
</template>

<style lang="scss" scoped>
button {
	transition: all 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}
</style>
