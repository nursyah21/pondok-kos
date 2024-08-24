<template>
	<UTooltip class="fixed bottom-0 right-0 z-50" text="refresh" :popper="{ placement: 'left' }">
		<UButton class="fixed bottom-4 right-2 m-4 bg-white" variant="link" @click="refresh"
			:icon="status == 'pending' ? 'i-svg-spinners-270-ring-with-bg' : 'i-pajamas-retry'" />
	</UTooltip>
</template>

<script setup lang="ts">
defineProps<{
	refresh: any
	status: any
}>()

</script>
