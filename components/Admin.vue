<template>
	<div class="flex gap-4 flex-col md:flex-row">
		<CardDashboard :status="status" title="Penghuni" icon="i-material-symbols-person" link="/dashboard/penghuni"
			color="bg-primary-400" :total="dashboard.totalPenghuni ?? 0" type="orang" />
		<CardDashboard :status="status" title="Penjaga" icon="i-material-symbols-person" link="/dashboard/user/data-penjaga"
			color="bg-blue-400" :total="dashboard.totalPenjaga ?? 0" type="orang" />
		<CardDashboard :status="status" title="Kos" icon="i-material-symbols-house" link="/dashboard/kos/data-kamar-kos"
			color="bg-yellow-400" :total="dashboard.totalKamarKos ?? 0" type="kamar" />
		<CardDashboard :status="status" title="Pendapatan" icon="i-material-symbols-attach-money"
			link="/dashboard/transaksi" color="bg-green-600" :total="dashboard.pendapatan ?? 0" />
	</div>

	<div class="flex flex-col md:flex-row  gap-4 overflow-hidden">
		<div class="flex-1">
			<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
				<template #header>
					List Penghuni
				</template>
			</UCard>
			<UTable :columns="data.penghuni.columns" :rows="rows">

			</UTable>
		</div>

		<UCard class="flex-1" :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
			<template #header>
				Chart Pendapatan 2024
			</template>
			<apexchart :options="dashboard.chartBarPendapatan?.options" :series="dashboard.chartBarPendapatan?.series">
			</apexchart>
		</UCard>
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
				label: 'tanggal bayar',
			},

		]
	}
}

watch(props.dashboard, (e) => {
	rows.value = e.listPenghuni
	console.log(e.listPenghuni)
}, { immediate: true })

</script>
