<template>
	<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
		<template #header>
			<h1>Kos yang dijaga</h1>
		</template>
		<div class="flex gap-4  overflow-scroll">
			<template v-for="i in dashboard.listkos">
				<UCard class="flex-shrink-0 max-w-[300px] max-h-[480px] " :ui="{ header: { padding: '' }, footer: {} }">
					<template #header>
						<img :src="i.imgkos" alt="" />
					</template>
					<div>
						<h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">
							{{i.kos}}
						</h1>
						<UDivider />
						<h1 class="text-xs text-slate-800">
							{{i.address}}
						</h1>						
					</div>
				</UCard>
			</template>
		</div>
	</UCard>

	<div class="flex flex-col md:flex-row  gap-4 overflow-hidden">
		<div class="flex-1">
			<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
				<template #header>
					List Penghuni
				</template>
			</UCard>
			<UTable :columns="data.penghuni.columns">

			</UTable>
		</div>

		
	</div>




</template>

<script setup lang="ts">
defineProps<{
	status: any;
	dashboard: DataDashboard;
}>()

const data = {
	penghuni: {
		columns: [
			{
				key: 'num',
				label: 'id',
			},
			{
				key: 'name',
				label: 'nama',
			},
			{
				key: 'kos',
				label: 'kos',
			},
			{
				key: 'kamar',
				label: 'kamar',
			},
			{
				key: 'tanggal_bayar',
				label: 'tanggal bayar',
			},

		]
	}
}

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
