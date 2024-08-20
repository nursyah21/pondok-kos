<template>

    <Breadcrumb />
    <main class="my-4">

        <!-- search -->
        <div :state="search" class="flex sm:flex-row flex-col sm:mr-2 border-b-2 py-2">
            <!-- pencarian berdasarkan nama penghuni -->
            <div class="flex items-center w-full">
                <UButton variant='link' color='gray' @click="add" icon="i-material-symbols-add-box" />
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    placeholder="Cari nama penghuni" class="w-full" v-model="search.q"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <UButton v-show="search.q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="search.q = ''" />
                    </template>
                </UInput>
            </div>
            <div class="flex mt-2 sm:mt-0">
                <!-- Filter status, sukses, menunggu, gagal -->
                <UDropdown :items="[
                    [{
                        label: 'filter status',
                        class: 'font-bold'
                    }],
                    [{
                        label: 'Sukses',
                        class: false ? '' : 'underline',
                        click: () => { }
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
                <UDropdown :items="[
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
                        class: false ? '' : 'underline',
                        click: () => { pageCount = 5 }
                    },
                    {
                        label: '15',
                        // class: false ? 'bg-yellow-500 text-white opacity-95 border border-yellow-500 my-2' : 'border border-yellow-500 my-2',
                        click: () => { pageCount = 15 }
                    },
                    {
                        label: '25',
                        // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
                        click: () => { pageCount = 25 }
                    },
                    {
                        label: '50',
                        // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
                        click: () => { pageCount = 50 }
                    },
                    {
                        label: '100',
                        // class: false ? 'bg-red-500 text-white opacity-95 border border-red-600 my-2' : 'border border-red-600 my-2',
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


        <UTable :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #_name-data="i">
                <div class="flex items-center gap-x-2">
                    <UAvatar :src="i.row.image" />
                    <UBadge v-if="i.row.hidden" color="yellow">{{ i.row._name }}</UBadge>
                    <h1 v-else>{{i.row._name}}</h1>
                </div>
            </template>
            <template #action-data="i">
                <UDropdown :items="[
                    [{
                        label: 'Edit',
                        disabled: i.row.hidden,
                        icon: 'i-material-symbols-light-edit',
                        click: () => edit(i.row)
                    },
                    {
                        label: 'Ubah status',
                        icon: 'i-material-symbols-light-edit',
                        click: () => hidden(i.row)
                    }]
                ]" :popper="{ placement: 'bottom-start' }">

                    <UButton variant="link" icon="i-mi-options-vertical" color="gray"/>
                </UDropdown>
            </template>
        </UTable>

        <Pagination :refresh="refresh" :total-page="totalPage" :page-count="pageCount" :page="page" :skip="skip"
            :status="status" :rows="rows" />

        <!-- modal crud add, update, delete -->
        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 v-if="mode == 'add'" class="font-bold text-slate-600">Tambahkan Kos</h1>
                        <h1 v-if="mode == 'edit'" class="font-bold text-slate-600">Edit Kos</h1>
                        <h1 v-if="mode == 'delete'" class="font-bold text-slate-600">Status Kos</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <UForm :state="stateKos" @submit="onSubmit" class="space-y-4">
                    <ImageUpload :changeImage="changeImageKos" v-model:image="image" v-model:loading="loading" :disabled="mode == 'delete' || stateKos.hidden"/>

                    <UFormGroup label="Nama Kos" name="name" class="w-full">

                        <UInput v-model="stateKos.name" placeholder="nama kos" autocomplete="off" 
                            :disabled="mode == 'delete' || stateKos.hidden" />
                    </UFormGroup>
                    <UFormGroup label="Deskripsi Kos" name="deskripsi" class="w-full">
                        <UTextarea v-model="stateKos.description" placeholder="deskripsi kos" autocomplete="off"
                            :disabled="mode == 'delete' || stateKos.hidden" />
                    </UFormGroup>
                    <UFormGroup label="Lokasi Kos" name="deskripsi" class="w-full">
                        <UInput v-model="stateKos.location" placeholder="lokasi kos" autocomplete="off"
                            :disabled="mode == 'delete' || stateKos.hidden" />
                    </UFormGroup>

                    <UFormGroup>
                        <template v-if="stateKos.hidden && mode == 'delete'">
                            <UButton color="green" :loading="loading" type="submit"
                                class="w-full text-center items-center justify-center">
                                Aktifkan
                            </UButton>
                        </template>
                        <template v-else-if="!stateKos.hidden && mode == 'delete'">
                            <UButton color="yellow" :loading="loading" type="submit"
                                class="w-full text-center items-center justify-center">
                                Non Aktifkan
                            </UButton>
                        </template>
                        <UButton v-else :color="mode == 'delete' || stateKos.hidden ? 'yellow' : 'green'" :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            {{ mode == 'add' ? 'Submit' : mode == 'edit' ? 'Update' : 'Ubah Status' }}
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
const totalPage = ref(0)
const rows = ref([])
const isOpen = ref(false)
const mode: Ref<ModeCrud> = ref('add')
const loading = ref(false)
const imageModal = ref(false)
const search = reactive({
    q: '',
    filter: '',
    sort: '',
    size: ''
})

const columns = [{
    key: 'num',
    label: 'id',
},
{
    key: '_name',
    label: 'nama',
},
{
    key: '_description',
    label: 'deskripsi',
},
{
    key: '_location',
    label: 'lokasi',
},
{
    key: 'action',
    label: 'aksi',
},
]

const query = computed(() => ({ skip: skip.value, limit: pageCount }))
const { data: raw, status, refresh } = await useFetch('/api/kos/get', {
    query,
    method: 'get'
})
if (status.value == 'success') {
    // @ts-ignore
    const { total, data } = raw.value
    totalPage.value = total
    rows.value = data
}

const stateKos = reactive({
    name: '',
    description: '',
    location: '',
    _id: '',
    hidden: false
})
const image = ref('')

const resetState = () => {
    stateKos.name = ''
    stateKos.description = ''
    stateKos.location = ''
    image.value = ''
    stateKos.hidden = false
    stateKos._id = ''
}
const helperState = (e: any) => {
    const { name, description, location, image: _image, _id, hidden } = e
    stateKos.name = name
    stateKos.description = description
    stateKos.location = location
    stateKos.hidden = hidden

    if (_image) {
        image.value = _image
    }
    stateKos._id = _id
}


const add = (e: any) => {
    isOpen.value = true
    mode.value = 'add'
    resetState()
}

const edit = (e: any) => {
    isOpen.value = true
    mode.value = 'edit'
    helperState(e)
}

const hidden = (e: any) => {
    isOpen.value = true
    mode.value = 'delete'
    helperState(e)
}

const onSubmit = (e: any) => {
    return mode.value == 'add' ? submitAddKos(e)
        : mode.value == 'edit' ? submitEditKos(e)
            : submitHiddenKos(e)
}

const submitEditKos = (e: any) => submitHelperPut(
    loading, isOpen, 'merubah kos', '/api/kos/edit',
    refresh, { ...e.data, image: image.value }
)

const submitAddKos = (e: any) => submitHelperPost(
    loading, isOpen, 'menambah kos', '/api/kos/add',
    refresh, { ...e.data, image: image.value }
)

const submitHiddenKos = (e: any) => submitHelperPost(
    loading, isOpen, 'hidden kos', '/api/kos/update-hidden',
    refresh, { ...e.data, image: image.value }
)


const changeImageKos = (e: any) => uploadFile(e, loading, image, 'add')

watch(useRoute().query, (e, _) => {
    // @ts-ignore
    skip.value = (e['page'] - 1) * pageCount
    refresh()
})

watch(status, (e, _) => {
    if(e != 'success') return
    
    // @ts-ignore
    const { data } = raw.value
    
    rows.value = data.map((items:any)=>({
        ...items,
        _name: shortWord(items.name, 50), 
        _location: shortWord(items.location, 50), 
        _description: shortWord(items.description, 50),
    }))
    
}, {immediate: true })


definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Unit Kos'
})
</script>