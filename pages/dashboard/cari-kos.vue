<template>

    <Breadcrumb />

    <AlertNotVerified :verified="verified" :role="role" />

    <main v-if="verified" class="my-4">
        <!-- <RefreshButton :refresh="refresh" v-model:status="status" /> -->
        <div class="my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 justify-items-center">
            <template v-for="i in rows" v-if="status == 'success'">
                <UCard class="max-w-[300px] max-h-[480px]" :ui="{ header: { padding: '' }, footer: {} }">
                    <template #header>
                        
                        <img v-if="i.available == 0" :src="i.image[0] ?? '/images/noimage.png'" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px]" />
                        <img v-else :src="i.image[0] ?? '/images/noimage.png'" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] opacity-30" />
                    </template>
                    <div>
                        <h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">{{ i.name }}</h1>
                        <h1 class="text-xs text-slate-800">{{ i.location }}</h1>
                        <UDivider />
                        <h1 class="my-4 text-sm text-slate-600 dark:text-slate-200">{{ i.description }}</h1>
                        <div v-if="i.description.length < 20" class="h-[6px]"></div>
                    </div>

                    <div class=" flex justify-between items-center ">
                        <h1 class="text-primary-600 font-bold">{{ i.price }}</h1>
                        <UButton v-if="i.available == 0" @click="addBoking(i)" :to="'/dashboard/cari-kos?kos=' + i.id">
                            Pesan kamar</UButton>
                        <UButton v-if="i.available == 1" color="yellow" disabled>Sedang dipesan</UButton>
                        <UButton v-if="i.available == 2" color="red" disabled>Sudah ditempati</UButton>
                    </div>
                </UCard>
            </template>

            <Pagination class='lg:col-span-2 xl:col-span-3' :refresh="refresh" :totalPage="totalPage" v-model:rows="rows" v-model:status="status" v-model:skip="skip" v-model:page="page" v-model:pageCount="pageCount" />
        </div>
        <!-- <div v-else class="flex justify-center items-center h-[80vh]">
            <UProgress class="max-w-md" />
        </div> -->
        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 class="font-bold text-slate-600 dark:text-slate-200">Pesan Kamar Kos</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>

                <UForm :state="state" @submit="submitMidtrans">
                    <div v-if="state.image && state.image.length" class="mb-2 p-2" >
                        <UCarousel  v-slot="{ item }" :items="state.image" class="mt-2"> 
                            <img :src="item" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] mr-2" />
                        </UCarousel>
                    </div>
                    
                    <div>
                        <h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">{{ state.name }}</h1>
                        <h1 class="text-xs text-slate-800">{{ state.location }}</h1>
                        <UDivider />
                        <h1 class="my-4 text-sm text-slate-600 dark:text-slate-200">{{ state.description }}</h1>
                        <div v-if="state.description.length < 20" class="h-[6px]"></div>
                        
                        <div class="my-2 border-t-2 pt-4">
                            <UFormGroup label="Tangal masuk">
                                <UInput type="date" :value="state.tgl_masuk" disabled />
                            </UFormGroup>

                            <UFormGroup label="Tangal keluar">
                                <UInput type="date" :value="state.tgl_keluar" disabled />
                            </UFormGroup>
                        </div>
                        <h1 class="text-slate-600 dark:text-slate-200 font-bold  pt-2">Durasi sewa: 30 hari</h1>
                        <h1 class="text-primary-600 font-bold ">{{ state.price }}</h1>
                        
                        <div v-if="state.available == 1" class="text-center text-sm text-slate-600 dark:text-slate-200  p-2 rounded-md">
                            masuk ke <ULink to="/dashboard/transaksi" class="text-blue-500 hover:underline">riwayat transaksi</ULink> jika anda memesan kamar ini
                        </div>

                        <div class="mt-4 flex justify-between">
                            <UButton v-if="state.link" color="blue" to="/dashboard/transaksi"
                                class="w-full text-center items-center justify-center">Buka Transaksi</UButton>
                            <template v-else>
                                <UButton class="w-full text-center items-center justify-center" :loading="loading"
                                    v-if="state.available == 0" type="submit">Lanjutkan</UButton>
                                <UButton class="w-full text-center items-center justify-center"
                                    v-if="state.available == 1" color="yellow" disabled>Sedang dipesan</UButton>
                                <UButton class="w-full text-center items-center justify-center"
                                    v-if="state.available == 2" color="red" disabled>Sudah ditempati</UButton>
                            </template>


                        </div>
                    </div>
                </UForm>
            </UCard>

        </UModal>

    </main>
</template>

<script setup lang="ts">
const _data = await myProfile()

let role = 0
let verified = false
if (_data.data) {
    role = _data.data.role
    verified = _data.data.verified
}

const loading = ref(false)
const isOpen = ref(false)
const pageCount = 9
const page = ref(1)
const skip = ref(0)
const rows = ref<[Kos]>()
const totalPage = ref(0)

const state = reactive({
    name: '',
    description: '',
    location: '',
    tgl_masuk: getDateNow(),
    tgl_keluar: getNextDate(30),
    available: 0,
    price: formatRupiahIntl(0),
    image: [''],
    id_kamar_kos: '',
    link: '',
    id_kos: '',
    _id: ''
})


const stateReset = () => {
    state.name = ''
    state.description = ''
    state.price = formatRupiahIntl(0)
    state.image = ['']
    // @ts-ignore
    state.id_kos = useRoute().params.id
    state._id = ''
}

const query = computed(() => ({ skip: skip.value, limit: pageCount }))
const { data: raw, status, refresh } = await useFetch('/api/kamar-kos/get', {
    query,
    method: 'get',
})


const addBoking = (e: any) => {
    state.link = ''
    state.image = e.image
    state.name = e.name
    state.location = e.location
    state.description = e.description
    state.price = e.price
    state.id_kamar_kos = e.id
    state.available = e.available
    isOpen.value = true
}
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
                refresh()
                state.link = e
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

watch(page, (e, _) => {        
    skip.value = (e - 1) * pageCount
    refresh()        
})

watch(status, (e, _) => {
    if(e != 'success') return
    
    // @ts-ignore
    const { data, total } = raw.value
    rows.value = data
    totalPage.value = total

    const kos = useRoute().query.kos
    if(!kos) return
    
    state.link = ''
    isOpen.value = true
    const _kos = data.find((e: any) => e.id == kos)
    state.image = _kos.image
    state.name = _kos.name
    state.location = _kos.location
    state.description = _kos.description
    state.price = _kos.price
    state.id_kamar_kos = _kos.id
    state.available = _kos.available
    
}, {immediate: true })

definePageMeta({
    layout: 'dashboard'
})
useHead({
    title: 'Cari Kos'
})
</script>