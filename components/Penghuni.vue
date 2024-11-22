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
						<div class="flex justify-between items-center ">
							<h1 class="text-slate-800">tersisa: <span class="font-bold"
									:class="i.tersisa <= 0 ? 'text-red-800' : 'text-blue-800'">{{ i.tersisa }}
									hari</span></h1>
							<UButton v-show="i.tersisa <= 0" class=" text-center items-center justify-center"
								@click="addBoking(i)">
								Perpanjang</UButton>
						</div>
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

	<UModal v-model="isOpen">
		<UCard>
			<template #header>
				<div class="items-center justify-between flex">
					<h1 class="font-bold text-slate-600 dark:text-slate-200">Pesan Kamar Kos</h1>
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="{
						isOpen = false;
						// @ts-ignore
						// navigateTo('/dashboard/cari-kos')
					}" />
				</div>
			</template>

			<UForm :state="state" @submit="submitMidtrans">
				<div v-if="state.image && state.image.length" class="mb-2 p-2 justify-center flex">
					<img :src="state.image" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] mr-2 rounded-lg" />

					<!-- <UCarousel v-slot="{ item }" :items="state.image" class="mt-2">
						<img :src="item" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] mr-2" /> -->
					<!-- </UCarousel> -->
				</div>

				<div>
					<h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">{{ state.kamar }}</h1>
					<h1 class="text-sm text-slate-600 dark:text-slate-200">{{ state.kos }}</h1>
					<UDivider />
					<h1 class="text-xs text-slate-800 mt-2">{{ state.location }}</h1>
					<!-- <h1 class="my-4 text-sm text-slate-600 dark:text-slate-200">{{ state.description }}</h1> -->
					<!-- <div v-if="state.description.length < 20" class="h-[6px]"></div> -->

					<!-- <div class="my-2 border-t-2 pt-4">
                            <UFormGroup label="Tangal masuk">
                                <UInput type="date" :value="state.tgl_masuk" disabled />
                            </UFormGroup>

                            <UFormGroup label="Tangal keluar">
                                <UInput type="date" :value="state.tgl_keluar" disabled />
                            </UFormGroup>
                        </div> -->
					<h1 class="text-slate-600 dark:text-slate-200 font-bold  pt-2">Durasi sewa: 30 hari</h1>					
					<h1 class="text-primary-600 font-bold ">Rp{{ formatRupiahIntl(state.pricekos) }}</h1>

					<!-- <div v-if="state.available == 1"
						class="text-center text-sm text-slate-600 dark:text-slate-200  p-2 rounded-md">
						masuk ke <ULink to="/dashboard/riwayat-transaksi" class="text-blue-500 hover:underline">
							riwayat
							transaksi</ULink> jika anda memesan kamar ini
					</div> -->

					
					<div class="mt-4 flex justify-between">
						<UButton class="w-full text-center items-center justify-center" :loading="loading"
							type="submit">Lanjutkan</UButton>
						<!-- <UButton v-if="state.link" color="blue" to="/dashboard/riwayat-transaksi"
							class="w-full text-center items-center justify-center">Buka Transaksi</UButton>
						<template v-else>
							<UButton class="w-full text-center items-center justify-center" v-if="state.available == 1"
								color="yellow" disabled>Sedang dipesan</UButton>
							<UButton class="w-full text-center items-center justify-center" v-if="state.available == 2"
								color="red" disabled>Sudah ditempati</UButton>
						</template> -->


					</div>
				</div>
			</UForm>
		</UCard>

	</UModal>


</template>

<script setup lang="ts">
const props = defineProps<{
	status: any;
	dashboard: DataDashboard;
}>()
const bayarBulanan = ref(false)
const rows = ref<any[] | undefined>()
const isOpen = ref(false)
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

const state = reactive({
	name: '',
	description: '',
	location: '',
	kos: '',
	kamar: '',
	tgl_masuk: getDateNow(),
	tgl_keluar: getNextDate(30),
	available: 0,
	price: formatRupiahIntl(0),
	image: '',
	id_kamar_kos: '',
	duration: '',
	pricekos:0,
	link: '',
	id_kos: '',
	_id: ''
})

const addBoking = (e: any) => {
	state.link = ''
	state.image = e.imgkos
	state.name = e.kos
	state.kos = e.kos
	state.kamar = e.kamar
	state.location = e.address
	state.description = e.description
	state.price = e.price
	state.duration = e.duration
	state.id_kamar_kos = e.id_kamar_kos
	state.pricekos = e.pricekos
	state.available = e.available
	isOpen.value = true
}

const loading = ref(false)
async function submitMidtrans(event: any) {
	const { price, id_kamar_kos } = event.data
	loading.value = true

	const order_id = "order_id_" + Math.round((new Date()).getTime() / 1000)
	const parameter = {
		"transaction_details": {
			order_id,
			"gross_amount": price
		}
		, "credit_card": {
			"secure": true
		}
	};


	// return loading.value = false
	$fetch('/api/booking/midtrans', {
		method: 'post',
		body: { parameter }
	}).then(async function (e) {
		try {
			const res = await $fetch('/api/booking/add-booking-midtrans', {
				headers: {
					Authorization: `Bearer ${token}`
				},
				method: 'post',
				body: { link_payment: e, id_kamar_kos, order_id }
			})
			if (res.status == 'success') {
				// refresh()
				state.link = e
				navigateTo("/dashboard/riwayat-transaksi")
			}
		} catch (error: any) {
			useToast().add({ id: 'fail', title: error.data.status, description: error.data.message, color: 'red' })
		}
	}).catch(e => {
		useToast().add({ id: 'fail', title: e.message, color: 'red' })
	}).finally(() => {
		loading.value = false
		// isOpen.value = false
	})
}

watch(props.dashboard, (e) => {
	rows.value = e.listTransaksi
}, { immediate: true })
</script>
