<template>
	<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
		<template #header>
			<h1>Kos yang dijaga</h1>
		</template>
		<div class="flex gap-4  overflow-scroll">
			<template v-for="i in dashboard.listKos">
				<UCard class="flex-shrink-0 max-w-[300px] max-h-[480px] " :ui="{ header: { padding: '' }, footer: {} }">
					<template #header>
						<img :src="i.imgkos" alt="" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px]" />
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
			<UTable :columns="data.penghuni.columns" :rows="rows"></UTable>
		</div>

		
	</div>




</template>

<script setup lang="ts">
const props = defineProps<{
	status: any;
	dashboard: DataDashboard;
}>()

const rows = ref<any[] | undefined>()
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
				label: 'tanggal masuk',
			},

		]
	}
}

watch(props.dashboard, (e) => {
	rows.value = e.listPenghuni	
}, { immediate: true })
</script>
