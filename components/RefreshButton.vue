<template>
	<UTooltip class="fixed bottom-0 right-0   " text="refresh data">
		<UButton class="fixed bottom-4 right-2 m-4 bg-white" variant="link" @click="refresh"
			:icon="status == 'pending' ? 'i-svg-spinners-270-ring-with-bg' : 'i-pajamas-retry'" />
	</UTooltip>
</template>

<script setup lang="ts">
defineProps<{
	refresh: (opts?: import("/home/nursyah/programmer/kos-ta-nursyah/node_modules/nuxt/dist/app/composables/asyncData").AsyncDataExecuteOptions) => Promise<void>;
}>()
const status = defineModel<import("/home/nursyah/programmer/kos-ta-nursyah/node_modules/nuxt/dist/app/index").AsyncDataRequestStatus>('status', { required: true })
</script>
