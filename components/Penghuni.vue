<template>
	<div class="flex gap-4 flex-col md:flex-row">
		<CardDashboard :status="status" title="Penghuni" icon="i-material-symbols-person" link="/dashboard/penghuni"
			color="bg-primary-400" :total="dashboard.totalPenghuni" type="orang" />
		<CardDashboard :status="status" title="Penjaga" icon="i-material-symbols-person" link="/dashboard/user/data-penjaga"
			color="bg-blue-400" :total="dashboard.totalPenjaga" type="orang" />
		<CardDashboard :status="status" title="Kos" icon="i-material-symbols-house" link="/dashboard/kos/data-kamar-kos"
			color="bg-yellow-400" :total="dashboard.totalKamarKos" type="kamar" />
		<CardDashboard :status="status" title="Pendapatan" icon="i-material-symbols-attach-money"
			link="/dashboard/transaksi" color="bg-green-600" :total="dashboard.pendapatan" />
	</div>

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

		<UCard class="flex-1" :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
			<template #header>
				Chart Pendapatan 2024
			</template>
			<apexchart :options="props.options" :series="props.series"></apexchart>
		</UCard>
	</div>
	ini penghuni

	<!-- - dashboard pemilik[] 
   - bar chart pendapatan kos []
   - list penghuni []  
- dashboard penjaga[]
   - card kos yang dijaga []
   - list penghuni[]
- dashboard penghuni[]
   - card kos yang dihuni[]
   - list tagihan yang udh dibayar[] -->



</template>

<script setup lang="ts">
defineProps<{
	status: any;
	dashboard: { totalPenghuni: string; totalPenjaga: string; totalKamarKos: string; pendapatan: number; chartPiePenghuni: { description?: string; options: any; series: any; }; chartBarPendapatan: { description?: string; options: any; series: any; }; chartLineTransaksi: { description?: string; options: any; series: any; }; };
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
