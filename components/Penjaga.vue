<template>
	<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
		<template #header>
			<h1>Kos yang dijaga</h1>
		</template>
		<div class="flex gap-4  overflow-scroll">
			<template v-for="i in 10">
				<UCard class="max-w-[300px] max-h-[480px] " :ui="{ header: { padding: '' }, footer: {} }">
					<template #header>
						<img src="https://static.mamikos.com/uploads/cache/data/style/2023-04-20/pfIeVtm1-360x480.jpg" alt="" />
					</template>
					<div>
						<h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">
							Kos Ketintang
						</h1>
						<UDivider />
						<h1 class="text-xs text-slate-800">
							Jl. Ketintang, Surabaya
						</h1>
						<h1 class="my-4 text-sm text-slate-600 dark:text-slate-200">
							<!-- {{ i.description }} -->
						</h1>
						<!-- <div v-if="i.description.length < 20" class="h-[6px]">
		
						</div> -->
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
