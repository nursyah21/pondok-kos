<template>
	<UCard :ui="{ header: { padding: 'py-2' }, body: { padding: 'py-0' } }">
		<template #header>
			<h1>Kos yang ditempati</h1>
		</template>
		<div class="flex gap-4 py-2 overflow-scroll">
			<template v-for="i in dashboard.listKos">
				<UCard class="flex-shrink-0 max-w-[300px] max-h-[480px] " :ui="{ header: { padding: '' }, footer: {} }">
					<template #header>
						<img :src="i.imgkos" alt="" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px]" />
					</template>
					<div>
						<h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">{{ i.kamar }}</h1>
						<h1 class="text-sm text-slate-600 dark:text-slate-200">{{ i.kos }}</h1>
						<UDivider />
						<h1 class="text-xs text-slate-800 mt-2">{{ i.address }}</h1>
						<h1 class="text-primary-600 font-bold pt-4 ">Rp{{ formatRupiahIntl(i.price) }}</h1>
						<h1 class="text-slate-800">tersisa: <span class="text-blue-800 font-bold">{{ i.tersisa }} hari</span></h1>
						<!-- <UDivider class="my-2" />
						<div class="flex gap-x-2 items-center">
							<UToggle v-model="bayarBulanan" />bulanan
						</div>
						<h1 v-if="bayarBulanan" class="text-slate-600 dark:text-slate-200 pt-2">Jatuh Tempo: <span
								class="font-bold">
								{{ getNextDate(30) }}
							</span>
						</h1>
						<h1 class="pt-2 h-[32px]" v-else></h1>
						<UButton class="w-full text-center items-center justify-center">Kirimkan tagihan Bayar Bulanan</UButton> -->
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
			<UTable :columns="data.penghuni.columns" :rows="rows">

			</UTable>
		</div>

	</div>



</template>

<script setup lang="ts">
const props = defineProps<{
	status: any;
	dashboard: DataDashboard;
}>()
const bayarBulanan = ref(false)
const rows = ref<any[] | undefined>()
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
				label: 'tanggal masuk',
			},

		]
	}
}

watch(props.dashboard, (e) => {
	rows.value = e.listTransaksi
}, { immediate: true })
</script>
