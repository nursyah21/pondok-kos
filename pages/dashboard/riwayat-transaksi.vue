<template>

    <Breadcrumb />

    <div v-if="status == 'error'">
        <h1 class="text-red-600">
            there's an error in page here, call a developer
        </h1>
    </div>
    <main class="my-4" v-else>

        <div  class="flex sm:flex-row flex-col sm:mr-2 border-b-2 py-2" >            
                
            <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    :placeholder="role === 0 ? 'Cari nama kos' : 'Cari nama penghuni'" class="w-full" v-model="q"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="q = ''" />
                    </template>
                </UInput>
                <div class="flex mt-2 sm:mt-0">
                    <!-- Filter status, sukses, menunggu, gagal -->
                    <UDropdown class="hidden" :items="[
                        [{
                            label: 'filter status',
                            class: 'font-bold'
                        }],
                        [{
                            label: 'Sukses',
                            class: false ? '' : 'underline',
                            click: () => { searchSubmit({filter:search.filter}) }
                        },
                        {
                            label: 'Menunggu',
                            // class: false ? 'bg-yellow-500 text-white opacity-95 border border-yellow-500 my-2' : 'border border-yellow-500 my-2',
                            click: () => { }
                        },
                        {
                            label: 'Gagal',
                            // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
                            click: () => { }
                        },
                        ]
                    ]" :popper="{ placement: 'bottom-start' }">
                        <UButton variant="link" icon="i-material-symbols-filter-alt" color="gray" />
                    </UDropdown>

                    <!-- Urutkan penghuni, kos, kamar, harga, tanggal -->
                    <UDropdown class="hidden" :items="[
                        [{
                            label: 'urutkan',
                            class: 'font-bold'
                        }],
                        [{
                            label: 'Terbaru',
                            class: false ? '' : 'underline',
                            click: () => { }
                        },
                        {
                            label: 'Terlama',
                            // class: false ? 'bg-yellow-500 text-white opacity-95 border border-yellow-500 my-2' : 'border border-yellow-500 my-2',
                            click: () => { }
                        },
                        {
                            label: 'Harga Tertinggi',
                            // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
                            click: () => { }
                        },
                        {
                            label: 'Harga Terendah',
                            // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
                            click: () => { }
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
                            // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
                            click: () => { pageCount = -1 }
                        },
                        ]
                    ]" :popper="{ placement: 'bottom-start' }">
                        <UButton variant='link' color="gray" icon="i-material-symbols-data-table" />
                    </UDropdown>
                </div>                
        </div>

        <UTable :loading="status != 'success' || loading" :rows="rows" :columns="columns" >
            <template #user_name-data="i">
                <div class="items-center flex gap-x-3">
                    <UAvatar :src="i.row.avatar" />
                    {{ i.row.user_name }}
                </div>
            </template>
            <template #link_payment-data="i">
                <a :href="i.row.link_payment" v-if="i.row.method_payment === 'midtrans'" class="hover:opacity-80">
                    <UBadge color="blue">
                        link
                    </UBadge>
                </a>                
            </template>
            <template #action-data="i">
                <UDropdown :items="[
                    [
                        {
                            label: 'Batalkan transaksi',
                            icon: 'i-material-symbols-light-delete',
                            disabled: i.row.paid_status == 'menunggu' ? false : true,
                            click: () => submitDeleteBooking(i.row)
                        },
                        {
                            label: 'Bayar',
                            icon: 'i-material-symbols-payments',
                            disabled: i.row.paid_status == 'menunggu' ? false : true,
                            click: () => openPayment(i.row)
                        },
                        {
                            label: 'Invoice',
                            icon: 'i-material-symbols-lab-profile',
                            disabled: i.row.paid_status == 'sukses' ? false : true,
                            click: () => (invoiceOpen = true, dataInvoice = i.row)
                        },
                    ]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-mi-options-vertical" color="gray" />
                </UDropdown>
            </template>
        </UTable>
        
        
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
        

        <!-- modal bukti pembayaran -->
        <UModal v-model="invoiceOpen" :ui="{ overlay: { background: 'print:bg-white' } }">
            <UCard class="print:hidden">
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 class="font-bold text-slate-600 dark:text-slate-200">Invoice</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="invoiceOpen = false" />
                    </div>
                </template>
            </UCard>
            <Invoice :data="dataInvoice" />
        </UModal>

        <!-- edit -->
        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 class="font-bold text-slate-600 dark:text-slate-200">Verifikasi transaksi</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <UForm :state="state" class="space-y-4" @submit="onUpdateTransaksi">
                    <img v-show="attachment" :src="attachment" alt="image attachment" class="w-[200px] h-[200px] ">
                    <UFormGroup label="Nama" class="w-full">
                        <UInput v-model="state.name" placeholder="nama" autocomplete="off" disabled />
                    </UFormGroup>
                    <UFormGroup label="Kamar Kos" class="w-full">
                        <UInput v-model="state.kamarKos" placeholder="nama" autocomplete="off" disabled />
                    </UFormGroup>
                    <UFormGroup label="admin" class="w-full">
                        <UInput v-model="state.admin" placeholder="admin" autocomplete="off" disabled />
                    </UFormGroup>
                    <!-- <UFormGroup :label="'Harga Kamar Kos: ' + formatRupiahIntl(state.price)" class="w-full"> -->
                    <UFormGroup label="Harga Kamar Kos" class="w-full">
                        <UInput type="number" v-model="state.price" placeholder="harga kamar kos" required
                            autocomplete="off" :disabled="state.paid_status == 2" />
                    </UFormGroup>
                    <UFormGroup label="metode pembayaran" class="w-full">
                        <UInput v-model="state.metodePembayaran" placeholder="harga kamar kos" required
                            autocomplete="off" disabled />
                    </UFormGroup>



                    <UFormGroup v-if="state.paid_status != 2" label="Foto Bukti" class="w-full">
                        <UInput type="file" icon="i-heroicons-folder" accept="image/*" @change="_uploadFile" />
                    </UFormGroup>
                    <UInput v-model="state._id" class="hidden" />
                    <UFormGroup>
                        <UButton v-if="state.paid_status == 2" color="red" :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            Batalkan pembayaran
                        </UButton>
                        <UButton v-else :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            Verifikasi pembayaran
                        </UButton>
                    </UFormGroup>
                </UForm>
            </UCard>


        </UModal>
    </main>
</template>

<script setup lang="ts">
const page = ref(1)
const pageCount = ref(5)
const skip = ref(0)
const rows = ref([])
const q = ref('')
const totalPage = ref(0)

const isOpen = ref(false)
const invoiceOpen = ref(false)
const dataInvoice = ref<any>()

const _data = await myProfile()
let role = 0
let verified = false
if (_data.data) {
    role = _data.data.role
    verified = _data.data.verified
}


const search = reactive({
    q: '',
    filter: '',
    sort: '',
    size: ''
})

const searchSubmit = async (e:any) => {
    useRouter().push({query: e})
}


const state = reactive({
    name: '',
    kamarKos: '',
    admin: '',
    price: 0,
    metodePembayaran: 'manual',
    attachment: undefined,
    paid_status: 0,
    _id: '',
    verified: true //true verifkasi, false batalkan verifikasi
})
const attachment = ref('')
const loading = ref(false)
const _uploadFile = (e: any) => uploadFile(e, loading, attachment)

const query = computed(() => ({ 
    skip: skip.value, 
    q: q.value,
    limit: pageCount.value == -1 ? pageCount.value * totalPage.value : pageCount.value 
}))

const { data: raw, status, refresh } = await useFetch('/api/booking/all-booking', {
    headers: {
        Authorization: `Bearer ${token}`
    },
    query, method: 'get'
})



const onUpdateTransaksi = async (event: any) => {
    loading.value = true
    const { _id, attachment, verified, price } = event.data
    const link = verified ? '/api/booking/verify-booking' : '/api/booking/fail-booking'

    try {
        const res = await $fetch(link, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: { _id, attachment, price }
        })

        if (res.status == 'success') {
            // @ts-ignore
            useToast().add({ id: 'update booking', title: res.message })
            refresh()
        }
    } catch (error: any) {
        if (error.data) {
            error = error.data
        }
        useToast().add({ id: 'settings', title: 'error', description: error.message, color: 'red' })

    }

    isOpen.value = false
    loading.value = false
}

// end update transaksi payment
const openPayment = async (e: any) => {
    const { link_payment } = e
    const midtrans = link_payment.split('/').pop()

    const updateBooking = async (link_payment: any, result: any) => {
        await $fetch('/api/booking/update-booking', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: { link_payment, result }
        })
        refresh()
    }


    // update booking
    snap.pay(midtrans, {
        onSuccess: async function (result: any) {
            await updateBooking(link_payment, result)
        },
        onPending: async function (result: any) {
            await updateBooking(link_payment, result)
        },
        onError: async function (result: any) {
            await updateBooking(link_payment, result)
        },
        onClose: async function (result: any) {
            await updateBooking(link_payment, result)
        }
    })

}

let columns:any[] = []

const columns_penghuni = [{
    key: 'num',
    label: 'id',
},
{
    key: 'tgl',
    label: 'masuk'
},
{
    key: 'name_kos',
    label: 'kos',
},
{
    key: 'name_kamar',
    label: 'kamar',
},
{
    key: 'price',
    label: 'harga',
},
{
    key: 'method_payment',
    label: 'metode',
},
{
    key: 'paid_status',
    label: 'status',
},
{
    key: 'action',
    label: 'aksi',
},
]

const columns_penjaga = [{
    key: 'num',
    label: 'id',
},
{
    key: 'tgl',
    label: 'masuk'
},
{
    key: 'user_name',
    label: 'nama'
},
{
    key: 'user_phone',
    label: 'nomor whatsapp'
},
{
    key: 'name_kos',
    label: 'kos',
},
{
    key: 'name_kamar',
    label: 'kamar',
},
{
    key: 'price',
    label: 'harga',
},
{
    key: 'method_payment',
    label: 'metode pembayaran',
},
{
    key: 'link_payment',
    label: 'bukti pembayaran',
},
{
    key: 'paid_status',
    label: 'status pembayaran',
},
{
    key: 'action',
    label: 'aksi',
},
]

const columns_pemilik = [{
    key: 'num',
    label: 'id',
},
{
    key: 'user_name',
    label: 'nama'
}
,{
    key: 'user_phone',
    label: 'nomor whatsapp'
},
{
    key: 'name_kos',
    label: 'kos',
},
{
    key: 'name_kamar',
    label: 'kamar',
},
{
    key: 'price',
    label: 'harga',
},
{
    key: 'tgl',
    label: 'tanggal'
},
{
    key: 'paid_status',
    label: 'status',
},
{
    key: 'action',
    label: 'aksi',
},
]

if (role == 0) {
    columns = columns_penghuni
} else if (role == 1) {
    columns = columns_penjaga
} else if (role == 2) {
    columns = columns_pemilik
}

const submitDeleteBooking = async (event: any) => {
    loading.value = true    
    const { _id } = event
    
    try {
        const res = await $fetch('/api/booking/delete-booking', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: { _id }
        })

        if (res.status == 'success') {
            // @ts-ignore
            useToast().add({ id: 'hapus booking', title: res.message })
            refresh()
        }
    } catch (error: any) {        
        useToast().add({ id: 'settings', title: 'error', description: error.data.message, color: 'red' })
    }

    loading.value = false
}

watch(page, (e,_)=>{
    skip.value = (e - 1) * pageCount.value    
    refresh()
})

watch(status,(e, _) => {
    if (e != 'success') return
    
    // @ts-ignore
    let { data, total } = raw.value
    totalPage.value = total
    // change color based on paid_value:
    rows.value = data 
}, {immediate: true})

definePageMeta({
    layout: 'dashboard'
})
useHead({
    title: 'Riwayat Transaksi'
})
</script>