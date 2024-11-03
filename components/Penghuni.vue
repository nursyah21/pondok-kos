<template>
	<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
		<template #header>
			<h1>Kos yang ditempati</h1>
		</template>
		<div class="flex gap-4 py-2 overflow-scroll">
			<template v-for="i in 2">
				<UCard class="flex-shrink-0 max-w-[300px] max-h-[480px] " :ui="{ header: { padding: '' }, footer: {} }">
					<template #header>
						<img src="https://static.mamikos.com/uploads/cache/data/style/2023-04-20/pfIeVtm1-360x480.jpg" alt="" />
					</template>
					<div>
						<h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">
							Kamar 1
						</h1>
						<UDivider />
						<h1 class="text-xs text-slate-800">
							Jl. Ketintang
						</h1>
						<h1 class="text-primary-600 font-bold pt-4 ">Rp{{ formatRupiahIntl("100000") }}</h1>
						<UDivider  class="my-2"/>
						<div class="flex gap-x-2 items-center">
							<UToggle v-model="bayarBulanan" />bulanan
						</div>
						<h1 v-if="bayarBulanan" class="text-slate-600 dark:text-slate-200 pt-2">Jatuh Tempo: <span class="font-bold">
							{{getNextDate(30)}}
						</span>
						</h1>
						<h1 class="pt-2 h-[32px]" v-else></h1>
						<!-- <UButton class="w-full text-center items-center justify-center">Kirimkan tagihan Bayar Bulanan</UButton> -->
					</div>
				</UCard>
			</template>
		</div>
	</UCard>

	<div class="flex flex-col md:flex-row  gap-4 overflow-hidden">
		<div class="flex-1">
			<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
				<template #header>
					Riwayat Pembayaran
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
const bayarBulanan = ref(false)

const data = {
	penghuni: {
		columns: [
		{
			key: 'num',
			label: 'id',
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
			key: 'price',
			label: 'harga',
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
