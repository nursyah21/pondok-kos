<template>
	<div class="flex gap-4 flex-col md:flex-row">
		<CardDashboard :status="status" title="Penghuni" icon="i-material-symbols-person" link="/dashboard/penghuni"
			color="bg-primary-400" :total="dashboard.totalPenghuni" type="orang" />
		<CardDashboard :status="status" title="Penjaga" icon="i-material-symbols-person"
			link="/dashboard/user/data-penjaga" color="bg-blue-400" :total="dashboard.totalPenjaga" type="orang" />
		<CardDashboard :status="status" title="Kos" icon="i-material-symbols-house" link="/dashboard/kos/data-kamar-kos"
			color="bg-yellow-400" :total="dashboard.totalKamarKos" type="kamar" />
		<CardDashboard :status="status" title="Pendapatan" icon="i-material-symbols-attach-money"
			link="/dashboard/transaksi" color="bg-green-600" :total="dashboard.pendapatan" />
	</div>

	<!-- <div class="flex gap-4 flex-col md:flex-row">
		<ChartDashboard :description="dashboard.chartPiePenghuni.description"  :status="status"
			title="Penghuni" color="text-blue-600" :options-chart="dashboard.chartPiePenghuni.options"
			:series="dashboard.chartPiePenghuni.series" />

		<ChartDashboard :description="dashboard.chartBarPendapatan.description" :status="status"
			title="Pendapatan" color="text-primary-600" :options-chart="dashboard.chartBarPendapatan.options"
			:series="dashboard.chartBarPendapatan.series" />

	</div> -->


</template>

<script setup lang="ts">
defineProps<{
	status: any;
	dashboard: { totalPenghuni: string; totalPenjaga: string; totalKamarKos: string; pendapatan: number; chartPiePenghuni: { description?: string; options: any; series: any; }; chartBarPendapatan: { description?: string; options: any; series: any; }; chartLineTransaksi: { description?: string; options: any; series: any; }; };
}>()
</script>
