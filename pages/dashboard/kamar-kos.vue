<template>

    <Breadcrumb />
    <main class="my-4">

        <!-- search -->
        <div class="flex sm:flex-row flex-col sm:mr-2 border-b-2 py-2 dark:border-gray-700">

            <div class="flex items-center w-full">
                <UButton :disabled="!optionsKos.length" variant='link' color='gray' @click="add" icon="i-material-symbols-add-box" />
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    placeholder="Cari nama kamar" class="w-full" v-model="q"
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
                        label: 'dibooking',
                        class: filter == 'dibooking' ? 'underline' : '',
                        click: () => { filter = 'dibooking' }
                    },
                    {
                        label: 'ditempati',
                        class: filter == 'ditempati' ? 'underline' : '',
                        click: () => { filter = 'ditempati' }
                    },
                    {
                        label: 'non aktif',
                        class: filter == 'non aktif' ? 'underline' : '',
                        click: () => { filter = 'non aktif' }
                    },
                    {
                        label: 'aktif',
                        class: filter == 'aktif' ? 'underline' : '',
                        click: () => { filter = 'aktif' }
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

        <UTable :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #_kamar-data="i">
                <div class="flex items-center gap-x-4 text-">
                    <UAvatar :src="i.row.image[0] ? i.row.image[0] : '/images/noimage.png'" />
                    <UBadge v-if="i.row.hidden" color="gray">{{ i.row._kamar }}</UBadge>
                    <UBadge v-else-if="i.row.available == 1" color="yellow">{{ i.row._kamar }}</UBadge>
                    <UBadge v-else-if="i.row.available == 2" color="red">{{ i.row._kamar }}</UBadge>
                    <h1 v-else>{{ i.row._kamar }}</h1>
                </div>
            </template>

            <template #action-data="i">
                <UDropdown :items="[
                    [{
                        label: 'Edit',
                        disabled: i.row.available != 0 || i.row.hidden ? true : false,
                        icon: 'i-material-symbols-light-edit',
                        click: () => edit(i.row)
                    },
                    {
                        label: 'Ubah status',
                        disabled: i.row.available == 0 || i.row.hidden ? false : true,
                        icon: 'i-material-symbols-light-edit',
                        click: () => del(i.row)
                    }]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-mi-options-vertical" color="gray"/>
                </UDropdown>                
            </template>
        </UTable>

        <!-- pagination -->
        <div class="flex justify-between  items-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UButton v-if="rows && rows.length" variant='ghost' @click='refresh'  color='gray' :class="status == 'pending' && 'animate-pulse'" >
                <h1 v-if="pageCount == -1">
                    {{ page * pageCount + 2 }} - {{ totalPage }}
                </h1>
                <h1 v-else>
                    {{skip >= 1? skip + page - 1 : skip+page}} - {{ page * pageCount }} of {{ totalPage }}
                </h1>
            </UButton>
            <UButton v-else variant='ghost' @click='refresh'  color='gray' :class="status == 'pending' && 'animate-pulse'" >
                tidak tersedia
            </UButton>
            
            
            <UPagination :disabled="status != 'success'" v-model="page" :page-count="pageCount" :total="totalPage"  :ui="{
                wrapper: 'flex items-center gap-2',
                rounded: '!rounded-full min-w-[32px] justify-center',
                default: {
                    activeButton: {
                        variant: 'outline'
                    }
                }
            }" />
        </div>

        <!-- modal crud add, update, delete -->
        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 v-if="mode == 'add'" class="font-bold text-slate-600 dark:text-slate-200">Tambahkan Kos</h1>
                        <h1 v-if="mode == 'edit'" class="font-bold text-slate-600 dark:text-slate-200">Edit Kos</h1>
                        <h1 v-if="mode == 'delete'" class="font-bold text-slate-600 dark:text-slate-200">Status Kos</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <UCarousel v-slot="{ item }" :items="[...imageKos, '']" 
                        :ui="{
                            item: 'basis-full',
                            container: 'rounded-lg'
                        }" 
                        :prev-button="{
                            color: 'gray',
                            icon: 'i-heroicons-arrow-left-20-solid',
                            class: '-left-12'
                        }" 
                        :next-button="{
                            color: 'gray',
                            icon: 'i-heroicons-arrow-right-20-solid',
                            class: '-right-12'
                        }" 
                        arrows class="w-64 mx-auto"
                    >
                        <ImageUpload :changeImage="changeImageKos" :image="item" v-model:loading="loading"
                            :disabled="mode == 'delete'" draggable="false" />
                    </UCarousel>

                    <UFormGroup label="Kos" class="w-full">
                        <USelectMenu v-model="state.id_kos" :options="optionsKos" :disabled="mode == 'delete'" />
                    </UFormGroup>


                    <UFormGroup label="Tipe" name="name" class="w-full">
                        <USelectMenu v-model="state.tipe" :options="['Kos', 'Kontrakan']" :disabled="mode == 'delete'" />
                    </UFormGroup>

                    <UFormGroup label="Nama Kamar Kos" name="name" class="w-full">
                        <UInput v-model="state.name" placeholder="nama kos" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>

                    <UFormGroup label="Deskripsi Kamar Kos" name="deskripsi" class="w-full">
                        <UTextarea v-model="state.description" placeholder="deskripsi kos" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>

                    <UFormGroup :label="'Harga Kamar Kos'" name="harga" class="w-full">
                        <UInput class="flex-1" v-model="state.price" placeholder="harga kamar kos" autocomplete="off"
                            :disabled="mode == 'delete'">
                            <template #leading>
                                <span class="text-gray-500 dark:text-gray-400 text-xs">Rp</span>
                            </template>
                        </UInput>
                    </UFormGroup>

                    <!-- <UFormGroup :label="'Harga Harian'" name="harga" class="w-full">
                        <template #label>
                            <UCheckbox v-model="state.price_harian_on" name="notifications" label="Harga Harian Kamar Kos" />
                        </template>
                        <UInput class="flex-1" v-model="state.price_harian" placeholder="harga harian kamar kos" autocomplete="off"
                            :disabled="mode == 'delete' || !state.price_harian_on">
                            <template #leading>
                                <span class="text-gray-500 dark:text-gray-400 text-xs">Rp</span>
                            </template>
                        </UInput>
                    </UFormGroup> -->

                    <UFormGroup>
                        <template v-if="state.hidden && mode == 'delete'">
                            <UButton color="green" :loading="loading" type="submit"
                                class="w-full text-center items-center justify-center">
                                Aktifkan
                            </UButton>
                        </template>
                        <template v-else-if="!state.hidden && mode == 'delete'">
                            <UButton color="yellow" :loading="loading" type="submit"
                                class="w-full text-center items-center justify-center">
                                Non Aktifkan
                            </UButton>
                        </template>
                        <UButton v-else :color="mode == 'delete' ? 'red' : 'green'" :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            {{ mode == 'add' ? 'Submit' : mode == 'edit' ? 'Update' : 'Delete' }}
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
const q = ref('')
const filter = ref<'ditempati' | 'dibooking' | 'all' | 'non aktif' | 'aktif'>('aktif')
const sort = ref<'asc' | 'desc'>('asc')

const loading = ref(false)
const imageKos = ref<[string]>([''])

const columns = [{
    key: 'num',
    label: 'id',
},
{
    key: '_kamar',
    label: 'kamar',
},
{
    key: '_kos',
    label: 'kos',
},
{
    key: '_description',
    label: 'deskripsi',
},
{
    key: '_price',
    label: 'harga',
},
{
    key: 'action',
    label: 'aksi',
},
]

const query = computed(() => ({
    skip: skip.value,
    limit: pageCount.value == -1 ? pageCount.value * totalPage.value : pageCount.value,
    filter: filter.value,
    sort: sort.value,
    q: q.value,
}))

// @ts-ignore
const { data: kos } = await useFetch('/api/kos/get', {
    query: {only: 'name'},
    method: 'get'
})

// @ts-ignore
const optionsKosValue = kos.value.map(e=>({ value: e._id, name: e.name}))
const optionsKos = optionsKosValue.map((e:any) => e.name) 

const { data: raw, status, refresh } = await useFetch('/api/kamar-kos/get', {
    query,
    method: 'get'
})

const optionsAvailable = ['tersedia', 'tidak tersedia']

const state = reactive({
    id_kos: optionsKos[0],
    name: '',
    description: '',
    available: optionsAvailable[0],
    price: '350,000',
    _price: 350_000,
    price_harian: '50,000',
    _price_harian: 0,
    price_harian_on: false,
    _id_kos: optionsKosValue[0].value,
    hidden: false,
    _id: '',
    tipe: 'Kos'    
})

const image = ref('')

const resetState = () => {
    state.name = ''
    state.description = ''
    state.available = optionsAvailable[0],
    state.price = '350,000',
    state.price_harian = '50,000',
    state._price_harian = 0,
    state.price_harian_on = false,
    state.id_kos = optionsKos[0]    
    image.value = ''
    state._id = ''
    // @ts-ignore
    imageKos.value = []
}

const helperState = (e: any) => {
    const { kamar,name, description, available, price, image: _image, id, id_kos, hidden, price_harian, price_harian_on } = e
    console.log(e)
    state.name = kamar
    state.description = description
    state.available = available == 2 ? optionsAvailable[1] : optionsAvailable[1]
    state.price = price
    // state.id_kos = optionsKos.find((e: any) => e.value == id_kos).value
    // state._id_kos = optionsKosValue.find((e:any) => e.name == id_kos).value
    
    if(typeof price == 'string'){
        state._price = parseInt(price.replaceAll(',',''))
    }

    if(price_harian_on){
        state._price_harian = parseInt(price_harian.replaceAll(',',''))
    }
    state.hidden = hidden

    if (_image) {
        console.log(_image)
        image.value = _image
        imageKos.value = _image
    }
    state._id = id
    console.log(state)
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

const del = (e: any) => {
    isOpen.value = true
    mode.value = 'delete'
    helperState(e)
}

const onSubmit = (e: any) => {
    return mode.value == 'add' ? submitAddKos(e)
        : mode.value == 'edit' ? submitEditKos(e)
            : submitDeleteKos(e)
}

const submitEditKos = (e: any) => submitHelperPut(
    loading, isOpen, 'merubah kos', '/api/kamar-kos/edit',
    refresh, { ...e.data, image: imageKos.value }
)

const submitAddKos = (e: any) => submitHelperPost(
    loading, isOpen, 'menambah kos', '/api/kamar-kos/add',
    refresh, { ...e.data, image: imageKos.value }
)

const submitDeleteKos = (e: any) => submitHelperPost(
    loading, isOpen, 'menghapus kos', '/api/kamar-kos/update-hidden',
    refresh, { ...e.data, image: imageKos.value }
)

const changeImageKos = async (e: any) => {
    const res = await uploadFile(e, loading, image, 'add')
    
    // @ts-ignore
    imageKos.value = imageKos.value ? [...imageKos.value, res] : [res]    
}

watch([q, sort, filter], (e, _) => {
    refresh()
}, { deep: true })

watch(status, (e, _) => {
    if (e != 'success') return
    // @ts-ignore
    const { total, data } = raw.value
    totalPage.value = total
    rows.value = data.map((items:any)=>({
        ...items,
        _kamar: shortWord(items.kamar, 50), 
        _kos: shortWord(items.kos, 50), 
        _description: shortWord(items.description, 50),
        _price: formatRupiahIntl(items.price, true) //shortWord(items.description, 50),
    }))

}, { immediate: true })

watch([state], (e, _) => {
    e[0].price = formatRupiahIntl(e[0].price, false)
    e[0].price_harian = formatRupiahIntl(e[0].price_harian, false)
})


definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Kamar Kos'
})
</script>