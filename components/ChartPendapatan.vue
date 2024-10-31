<template>
	<UCard :ui="{ header: { padding: 'py-2' }, body: {padding:'py-0'} }">
		<template #header>
			Chart Pendapatan 2024
		</template>
		<apexchart :options="props.options" :series="props.series" class=""></apexchart>
	</UCard>
</template>

<script setup lang="ts">

const props = {
	options: {
		chart: {
			type: 'bar'
		}
	},
	series: [{
		data: [
			{ x: 'jan', y: 100 },
			{ x: 'feb', y: 100 },
			{ x: 'mar', y: 100 },
			{ x: 'apr', y: 100 },
			{ x: 'mei', y: 100 },
			{ x: 'jun', y: 100 },
			{ x: 'jul', y: 100 },
			{ x: 'agu', y: 100 },
			{ x: 'sep', y: 100 },
			{ x: 'okt', y: 100 },
			{ x: 'nov', y: 100 },
			{ x: 'dec', y: 100 },
		]
	}]
}


</script>
