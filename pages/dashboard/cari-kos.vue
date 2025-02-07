<template>

    <Breadcrumb />

    <AlertNotVerified :verified="verified" :role="role" />

    <main v-if="verified" class="my-4">

        <!-- search -->
        <div class="hidden sm:flex-row flex-col sm:mr-2 border-b-2 dark:border-gray-800 py-2">

            <div class="flex items-center w-full">
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    placeholder="Cari nama kos" class="w-full" v-model="q"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="q = ''" />
                    </template>
                </UInput>
            </div>
            <div class="flex mt-2 sm:mt-0">
                <UDropdown :items="[
                    [{
                        label: 'filter status',
                        class: 'font-bold'
                    }],
                    [{
                        label: 'semua',
                        class: filter == 'all' ? 'underline' : '',
                        click: () => { filter = 'all' }
                    },
                    {
                        label: 'tersedia',
                        class: filter == 'tersedia' ? 'underline' : '',
                        click: () => { filter = 'tersedia' }
                    },
                    {
                        label: 'dibooking',
                        class: filter == 'dibooking' ? 'underline' : '',
                        click: () => { filter = 'dibooking' }
                    },
                    {
                        label: 'ditempati',
                        class: filter == 'ditempati' ? 'underline' : '',
                        click: () => { filter = 'ditempati' }
                    },
                    ]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-material-symbols-filter-alt" color="gray" />
                </UDropdown>

                <UDropdown :items="[
                    [{
                        label: 'urutkan',
                        class: 'font-bold'
                    }],
                    [{
                        label: 'Terbaru',
                        class: sort == 'asc' ? 'underline' : '',
                        click: () => { sort = 'asc' }
                    },
                    {
                        label: 'Terlama',
                        class: sort == 'desc' ? 'underline' : '',
                        click: () => { sort = 'desc' }
                    },
                    ]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-material-symbols-sort" color="gray" />
                </UDropdown>


                <UDropdown :items="[
                    [{
                        label: 'data yang diambil',
                        class: 'font-bold'
                    }],
                    [{
                        label: '5',
                        class: pageCount == 5 ? 'underline' : '',
                        click: () => { pageCount = 5 }
                    },
                    {
                        label: '15',
                        class: pageCount == 15 ? 'underline' : '',
                        click: () => { pageCount = 15 }
                    },
                    {
                        label: '25',
                        class: pageCount == 25 ? 'underline' : '',
                        click: () => { pageCount = 25 }
                    },
                    {
                        label: '50',
                        class: pageCount == 50 ? 'underline' : '',
                        click: () => { pageCount = 50 }
                    },
                    {
                        label: '100',
                        class: pageCount == 100 ? 'underline' : '',
                        click: () => { pageCount = 100 }
                    },
                    {
                        label: 'tampilkan semua',
                        class: pageCount == -1 ? 'underline' : '',
                        click: () => { pageCount = -1 }
                    },
                    ]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant='link' color="gray" icon="i-material-symbols-data-table" />
                </UDropdown>
            </div>
        </div>

        <div class="my-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 justify-items-center"
            v-if="status == 'success' && totalPage">
            <template v-for="i in rows">
                <UCard class="max-w-[300px] max-h-[480px]" :ui="{ header: { padding: '' }, footer: {} }">
                    <template #header>
                        <img v-if="i.available != 0 || i.hidden" :src="i.image[0] ?? '/images/noimage.png'"
                            class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] opacity-30" />
                        <img v-else :src="i.image[0] ?? '/images/noimage.png'"
                            class="w-[300px] max-w-[300px] h-[260px] max-h-[260px]" />
                    </template>
                    <div>
                        <h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">{{ i.kamar }}</h1>
                        <h1 class="text-sm text-slate-600 dark:text-slate-200">{{ i.kos }}</h1>
                        <UDivider />
                        <h1 class="text-xs text-slate-800 mt-2">{{ i.address }}</h1>
                        <h1 class="my-4 text-sm text-slate-600 dark:text-slate-200">{{ i.description }}</h1>
                        <div v-if="i.description.length < 20" class="h-[6px]"></div>
                    </div>

                    <div class=" flex justify-between items-center ">
                        <h1 class="text-primary-600 font-bold">Rp{{ formatRupiahIntl(i.price) }}</h1>
                        <UButton v-if="i.hidden" color="gray" disabled>Tidak tersedia</UButton>
                        <template v-else>
                            <UButton v-if="i.available == 0" @click="addBoking(i)"
                                :to="'/dashboard/cari-kos?kos=' + i.id">
                                Pesan kamar</UButton>
                            <UButton v-if="i.available == 1" color="yellow" disabled>Sedang dipesan</UButton>
                            <UButton v-if="i.available == 2" color="red" disabled>Sudah ditempati</UButton>
                        </template>
                    </div>
                </UCard>
            </template>
        </div>

        <div v-else class="flex h-[80vh] justify-center items-center w-full text-slate-600 dark:text-slate-300 ">
            mohon maaf data kos belum tersedia
        </div>

        <!-- pagination -->
        <div class="flex justify-between  items-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UButton v-if="rows && rows.length" variant='ghost' @click='refresh' color='gray'
                :class="status == 'pending' && 'animate-pulse'">
                <h1 v-if="pageCount == -1">
                    {{ page * pageCount + 2 }} - {{ totalPage }}
                </h1>
                <h1 v-else>
                    {{ skip >= 1 ? skip + page - 1 : skip + page }} - {{ page * pageCount }} of {{ totalPage }}
                </h1>
            </UButton>
            <UButton v-else variant='ghost' @click='refresh' color='gray'
                :class="status == 'pending' && 'animate-pulse'">
                tidak tersedia
            </UButton>


            <UPagination :disabled="status != 'success'" v-model="page" :page-count="pageCount" :total="totalPage" :ui="{
                wrapper: 'flex items-center gap-2',
                rounded: '!rounded-full min-w-[32px] justify-center',
                default: {
                    activeButton: {
                        variant: 'outline'
                    }
                }
            }" />
        </div>

        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 class="font-bold text-slate-600 dark:text-slate-200">Pesan Kamar</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="{
                            isOpen = false;
                            // @ts-ignore
                            navigateTo('/dashboard/cari-kos')
                        }" />
                    </div>
                </template>

                <UForm :state="state" @submit="submitMidtrans">
                    <div v-if="state.image && state.image.length" class="mb-2 p-2">
                        <UCarousel v-slot="{ item }" :items="state.image" class="mt-2">
                            <img :src="item" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] mr-2" />
                        </UCarousel>
                    </div>

                    <div>
                        <h1 class="text-xl font-bold text-slate-600 dark:text-slate-200">{{ state.kamar }}</h1>
                        <h1 class="text-sm text-slate-600 dark:text-slate-200">{{ state.kos }}</h1>
                        <UDivider />
                        <h1 class="text-xs text-slate-800 mt-2">{{ state.location }}</h1>
                        <h1 class="my-4 text-sm text-slate-600 dark:text-slate-200">{{ state.description }}</h1>
                        <div v-if="state.description.length < 20" class="h-[6px]"></div>

                        <!-- <div class="my-2 border-t-2 pt-4">
                            <UFormGroup label="Tangal masuk">
                                <UInput type="date" :value="state.tgl_masuk" disabled />
                            </UFormGroup>

                            <UFormGroup label="Tangal keluar">
                                <UInput type="date" :value="state.tgl_keluar" disabled />
                            </UFormGroup>
                        </div> -->
                        <h1 class="text-slate-600 dark:text-slate-200 font-bold  pt-2">Durasi sewa: 30 hari</h1>
                        <h1 class="text-primary-600 font-bold ">Rp{{ formatRupiahIntl(state.price) }}</h1>

                        <div v-if="state.available == 1"
                            class="text-center text-sm text-slate-600 dark:text-slate-200  p-2 rounded-md">
                            masuk ke <ULink to="/dashboard/riwayat-transaksi" class="text-blue-500 hover:underline">
                                riwayat
                                transaksi</ULink> jika anda memesan kamar ini
                        </div>

                        <div class="mt-4 flex justify-between">
                            <UButton v-if="state.link" color="blue" to="/dashboard/riwayat-transaksi"
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
const page = ref(1)
const pageCount = ref(5)
const skip = ref(0)
const totalPage = ref(0)
const loading = ref(false)
const isOpen = ref(false)
const rows = ref<[Kos]>()
const q = ref('')
const filter = ref<'tersedia' | 'dibooking' | 'ditempati' | 'all'>('all')
const sort = ref<'asc' | 'desc'>('asc')


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
    image: [''],
    id_kamar_kos: '',
    link: '',
    id_kos: '',
    _id: ''
})


const query = computed(() => ({ skip: skip.value, limit: pageCount.value }))
const { data: raw, status, refresh } = await useFetch('/api/kamar-kos/get', {
    query,
    method: 'get',
})


const addBoking = (e: any) => {
    state.link = ''
    state.image = e.image
    state.name = e.kos
    state.kos = e.kos
    state.kamar = e.kamar
    state.location = e.address
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
    skip.value = (e - 1) * pageCount.value
    refresh()
})

watch(isOpen, (e, _) => {
    // if(isOpen)  return
    navigateTo('/dashboard/cari-kos')
})

watch(status, (e, _) => {
    if (e != 'success') return

    // @ts-ignore
    const { data, total } = raw.value
    rows.value = data
    totalPage.value = total    
    const kos = useRoute().query.kos
    if (!kos) return

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

}, { immediate: true })

definePageMeta({
    layout: 'dashboard'
})
useHead({
    title: 'Cari Kos'
})
</script>