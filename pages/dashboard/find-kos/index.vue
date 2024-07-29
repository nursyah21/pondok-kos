<template>

    <Breadcrumb />

    <AlertNotVerified :verified="verified" :role="role" />

    <main v-if="verified" class="my-4">
        <RefreshButton :refresh="refresh" v-model:status="status" />
        <div class="my-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-12 justify-items-center"
            v-if="status == 'success'">
            <template v-for="i in rows">
                <UCard class="max-w-[300px] max-h-[480px]" :ui="{ header: { padding: '' }, footer: {} }">
                    <template #header>
                        
                        <img v-if="i.available == 0" :src="i.image[0] ?? '/images/noimage.png'" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px]" />
                        <img v-else :src="i.image[0] ?? '/images/noimage.png'" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] opacity-30" />
                    </template>
                    <div>
                        <h1 class="text-xl font-bold text-slate-600">{{ shortWord(i.name, 10) }}</h1>
                        <h1 class="text-xs text-slate-800">{{ shortWord(i.location, 20) }}</h1>
                        <UDivider />
                        <h1 class="my-4 text-sm text-slate-600">{{ shortWord(i.description) }}</h1>
                        <div v-if="i.description.length < 20" class="h-[6px]"></div>
                    </div>

                    <div class=" flex justify-between items-center ">
                        <h1 class="text-primary-600 font-bold">{{ formatRupiahIntl(i.price) }}</h1>
                        <UButton v-if="i.available == 0" @click="addBoking(i)" :to="'/dashboard/find-kos?kos=' + i.id">
                            Pesan kamar</UButton>
                        <UButton v-if="i.available == 1" color="yellow" disabled>Sedang dipesan</UButton>
                        <UButton v-if="i.available == 2" color="red" disabled>Sudah ditempati</UButton>
                    </div>
                </UCard>
            </template>
            <div class="lg:col-span-2 xl:col-span-3 flex justify-center items-center">
                <UPagination :disabled="status != 'success'" v-model="page" :page-count="pageCount" :total="totalPage"
                    :to="(page) => ({
                        query: { page }
                    })" :ui="{
                wrapper: 'flex items-center gap-2',
                rounded: '!rounded-full min-w-[32px] justify-center',
                default: {
                    activeButton: {
                        variant: 'outline'
                    }
                }
            }" />
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-[80vh]">
            <UProgress class="max-w-md" />
        </div>
        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 class="font-bold text-slate-600">Pesan Kamar Kos</h1>
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
                        <h1 class="text-xl font-bold text-slate-600">{{ shortWord(state.name, 10) }}</h1>
                        <h1 class="text-xs text-slate-800">{{ shortWord(state.location, 20) }}</h1>
                        <UDivider />
                        <h1 class="my-4 text-sm text-slate-600">{{ shortWord(state.description) }}</h1>
                        <div v-if="state.description.length < 20" class="h-[6px]"></div>
                        
                        <div class="my-2 border-t-2 pt-4">
                            <UFormGroup label="Tangal masuk">
                                <UInput type="date" :value="getDateNow()" disabled />
                            </UFormGroup>

                            <UFormGroup label="Tangal keluar">
                                <UInput type="date" :value="getNextDate(30)" disabled />
                            </UFormGroup>
                        </div>
                        <h1 class="text-slate-600 font-bold  pt-2">Durasi sewa: 30 hari</h1>
                        <h1 class="text-primary-600 font-bold ">{{ formatRupiahIntl(state.price) }}</h1>
                        
                        <div v-if="state.available == 1" class="text-center text-sm text-slate-600  p-2 rounded-md">
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
    available: 0,
    price: 0,
    image: [''],
    id_kamar_kos: '',
    link: '',
    id_kos: '',
    _id: ''
})


const stateReset = () => {
    state.name = ''
    state.description = ''
    state.price = 0
    state.image = ['']
    // @ts-ignore
    state.id_kos = useRoute().params.id
    state._id = ''
}

const query = computed(() => ({ skip: skip.value, limit: pageCount }))
const { data: raw, status, refresh } = await useFetch('/api/v2/public/all-kamar-kos', {
    query,
    method: 'get',
})

watch(() => useRoute().query,
    (e) => {
        if (e.page) {
            // @ts-ignore
            skip.value = (e['page'] - 1) * pageCount
            refresh()
        }
    }, { deep: true })

watch(() => status, (e) => {
    if (e.value == 'success') {
        // @ts-ignore
        const { data, total } = raw.value
        rows.value = data
        totalPage.value = total

        const kos = useRoute().query.kos
        if (kos) {
            state.link = ''
            isOpen.value = true
            const _kos = data.find((e: any) => e.id == kos)
            console.log(_kos)
            state.image = _kos.image
            state.name = _kos.name
            state.location = _kos.location
            state.description = _kos.description
            state.price = _kos.price
            state.id_kamar_kos = _kos.id
            state.available = _kos.available
        }
    }
}, { deep: true, immediate: true })


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

    // console.log(price, id_kamar_kos)
    // return loading.value = false
    // prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
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
    $fetch('/api/v2/protect/midtrans', {
        method: 'post',
        body: { parameter }
    }).then(async function (e) {
        // console.log(e)
        try {
            const res = await $fetch('/api/v2/protect/booking/add-booking-midtrans', {
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

definePageMeta({
    layout: 'dashboard'
})
</script>