<template>

    <Breadcrumb />
    <main class="my-4">
    <!--
        <UButton :class="optionsKamarKos.length ? '' : 'hidden'" @click="add">Tambahkan Penghuni </UButton> 
        -->
        <!-- search -->
        <div class="hidden sm:flex-row flex-col sm:mr-2 border-b-2 dark:border-gray-800 py-2">

            <div class="flex items-center w-full">
                <UButton :class="optionsKamarKos.length ? '' : 'hidden'" variant='link' color='gray' @click="add"
                    icon="i-material-symbols-add-box" />
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    placeholder="Cari nama penghuni" class="w-full" v-model="q"
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


                <UDropdown class="hidden" :items="[
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


        <UTable :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #name-data="i">
                <div class="items-center flex gap-x-3">
                    <UAvatar :src="i.row.avatar" />
                    {{ i.row.name }}
                </div>
            </template>

            <template #price-data="i">
                {{ formatRupiahIntl(i.row.price) }}
            </template>

            <template #action-data="i">
                <UDropdown :items="[
                    [
                        {
                            label: 'Hapus Penghuni',
                            icon: 'i-material-symbols-light-delete',
                            click: () => del(i.row)
                        }]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-mi-options-vertical" />
                </UDropdown>
            </template>
        </UTable>



        <div class="hidden justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination :disabled="status != 'success'" v-model="page" :page-count="pageCount" :total="totalPage" :to="(page) => ({
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

        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 v-if="mode == 'add'" class="font-bold text-slate-600 dark:text-slate-200">Tambahkan penghuni
                        </h1>
                        <h1 v-if="mode == 'delete'" class="font-bold text-slate-600 dark:text-slate-200">Hapus penghuni
                        </h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>

                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <div class="flex justify-center">
                        <img onerror="this.src='/images/noimage.jpeg'" v-if="state.avatar" :src="state.avatar"
                            alt="image penghuni" class="w-[200px] h-[200px] text-center">
                    </div>

                    <UFormGroup label="Penghuni" class="w-full">
                        <USelect v-model="state.id_user" :options="optionsPenghuni" option-attribute="name"
                            autocomplete="off" :disabled="mode == 'delete'" required />
                    </UFormGroup>

                    <UFormGroup label="Kamar Kos" class="w-full">
                        <USelect v-model="state.id_kamar_kos" :options="optionsKamarKos" option-attribute="name"
                            autocomplete="off" :disabled="mode == 'delete'" required />
                    </UFormGroup>

                    <UFormGroup label="Tanggal Masuk" name="birth_date" class="w-full">
                        <UInput v-model="state.tanggal_bayar" type="date" required :disabled="mode == 'delete'" />
                    </UFormGroup>

                    <UFormGroup label="Durasi" name="duration" class="w-full" v-if="mode == 'add'">
                        <div class="flex items-center gap-x-2 ">
                            <UInput class="flex-1" type="number" max="10000000" min="1" v-model="state.duration"
                                placeholder="durasi sewa" autocomplete="off" required />
                            <p class="font-bold w-[100px]">{{ state.duration }}hari</p>
                        </div>
                    </UFormGroup>

                    <UFormGroup label="Harga" name="birth_date" class="w-full" v-if="mode == 'add'">
                        <div class="flex items-center gap-x-2 ">
                            <UInput class="flex-1" type="number" max="10000000" min="10000" v-model="state.price"
                                placeholder="harga kamar kos" autocomplete="off" required />
                            <p class="font-bold w-[100px]">{{ formatRupiahIntl(state.price) }}</p>
                        </div>
                    </UFormGroup>

                    <div class="flex justify-center">
                        <img v-if="image" :src="image" alt="image kos" class="w-[200px] h-[200px] ">
                    </div>
                    <UFormGroup label="Bukti Pembayaran" class="w-full" v-if="mode == 'add'">
                        <UInput type="file" icon="i-heroicons-folder" accept="image/*" @change="addAttachment" />
                    </UFormGroup>

                    <UFormGroup>
                        <UButton :color="mode == 'add' ? 'green' : 'red'" :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            {{ mode == 'add' ? 'Submit' : 'Delete' }}
                        </UButton>
                    </UFormGroup>
                </UForm>
            </UCard>

        </UModal>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard'
})
const router = useRoute()
const page = ref(1)
const pageCount = ref(5)
const skip = ref(0)
const totalPage = ref(0)
const rows = ref([])
const isOpen = ref(false)
const mode = ref<'add' | 'delete'>('add')
const columns = [{
    key: 'num',
    label: 'id',
},
{
    key: 'name',
    label: 'nama',
},
{
    key: 'number_phone',
    label: 'nomor whatsapp',
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
    label: 'tanggal masuk',
},
{
    key: 'price',
    label: 'harga',
},
{
    key: 'action',
    label: 'aksi',
},
]

// @ts-ignore
const { data: allPenghuni } = await $fetch('/api/penghuni/all-penghuni-kos', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    query: { 'onlyName': 1 },
    method: 'get'
})
const optionsPenghuni = allPenghuni.map((e: any) => ({ value: e.id_user, name: `${e.name} - ${e.number_phone}` }))

// @ts-ignore
const { data: allKamarKos, status: statusKamarKos, refresh: refreshKamarKos } = await useFetch('/api/kamar-kos/get', {
    method: 'get', query: { onlyName: 1 }
})
let optionsKamarKos = <any>[]

const q = ref('')
const sort = ref<'asc' | 'desc'>('asc')
const query = computed(() => ({
    skip: skip.value,
    limit: pageCount.value == -1 ? pageCount.value * totalPage.value : pageCount.value,
    // filter: filter.value,
    sort: sort.value,
    q: q.value,
}))
const { data: raw, status, refresh } = await useFetch('/api/penghuni/all-penghuni-kos', {
    headers: {
        Authorization: `Bearer ${token}`
    },
    query, method: 'get'
})
const image = ref('')

const state = reactive({
    id_user: '',
    id_kamar_kos: '',
    id_kos: '',
    tanggal_bayar: '',
    id: '',
    price: 0,
    price_harian: 0,
    duration: 30,
    avatar: '',
    attachment: ''
})
const loading = ref(false)

const resetState = () => {
    state.id = ''
    state.tanggal_bayar = getDateNow()
    state.id_user = ''
    if (optionsPenghuni[0]) {
        state.id_user = optionsPenghuni[0].value
    }
    if (optionsKamarKos[0]) {
        state.id_kamar_kos = optionsKamarKos[0].value
    }
    state.price = optionsKamarKos[0].price
    state.price_harian = optionsKamarKos[0].price_harian
    if (!state.price_harian) {
        state.duration = 30
    }

    image.value = ''
}


const helperState = (e: any) => {
    const { id_kamar_kos, id, id_user, id_kos, tanggal_bayar, avatar } = e
    if (tanggal_bayar) {
        state.tanggal_bayar = tanggal_bayar.split('-').reverse().join('-')
    }

    
    const _kamarkos = optionsKamarKos.find((e: any) => e.value == id_kamar_kos)    
    const _id_user = optionsPenghuni.find((e: any) => e.value == id_user)
    if (avatar) {
        state.avatar = avatar
    }
    if (_id_user) {
        state.id_user = id_user
    }
    if (_kamarkos) {
        state.id_kamar_kos = e.id_kamar_kos
    }
    state.id = id
}

const add = (e: any) => {
    resetState()
    isOpen.value = true
    mode.value = 'add'
}

const del = (e: any) => {
    helperState(e)
    isOpen.value = true
    mode.value = 'delete'
}

const onSubmit = (e: any) => {
    const { id_user, id_kamar_kos } = e.data
    if (mode.value == 'add') {
        return submitAdd({ ...e.data, id_user, id_kamar_kos })
    }
    if (mode.value == 'delete') {
        return submitDelete({ ...e.data, id_user, id_kamar_kos })
    }
}

const submitAdd = (e: any) => {
    submitHelperPost(
        loading, isOpen, 'addPenjaga', '/api/penghuni/add-penghuni-kos',
        refresh, { ...e }
    )
    refreshKamarKos()
}

const submitDelete = (e: any) => submitHelperDelete(
    loading, isOpen, 'delPenjaga', '/api/penghuni/delete-penghuni-kos',
    refresh, { ...e }
)

const addAttachment = async (e: any) => {
    await uploadFile(e, loading, image)
}


watch(() => router.query,
    (e) => {
        // @ts-ignore
        skip.value = (e['page'] - 1) * pageCount
        refresh()
    }, { deep: true })

watch(() => status, (e) => {
    if (e.value == 'success') {
        // @ts-ignore
        const { data, total } = raw.value
        totalPage.value = total
        rows.value = data
    }
}, { deep: true, immediate: true })

watch(() => statusKamarKos, (e) => {
    if (e.value == 'success') {
        // @ts-ignore
        const { data } = allKamarKos.value
        optionsKamarKos = data.map((e: any) => ({
            value: e.id, name: `${e.kamar} - ${e.kos}`,
            ...e
        }))

        if (optionsKamarKos[0]) {
            state.id_kamar_kos = optionsKamarKos[0].value
        }
    }
}, { deep: true, immediate: true })

useHead({
    title: 'Penghuni'
})
</script>