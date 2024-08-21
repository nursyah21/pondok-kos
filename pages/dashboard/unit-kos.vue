<template>

    <Breadcrumb />
    <main class="my-4">

        <!-- search -->
        <div class="flex sm:flex-row flex-col sm:mr-2 border-b-2 dark:border-gray-800 py-2">
            
            <div class="flex items-center w-full">
                <UButton variant='link' color='gray' @click="add" icon="i-material-symbols-add-box" />
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
                        class: filter == 'all'  ? 'underline' : '',
                        click: () => { filter = 'all'}
                    },
                    {
                        label: 'non aktif',
                        class: filter == 'non aktif'  ? 'underline' : '',
                        click: () => { filter = 'non aktif'}
                    },
                    {
                        label: 'aktif',
                        class: filter == 'aktif'  ? 'underline' : '',
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
            <template #_name-data="i">
                <div class="flex items-center gap-x-2">
                    <UAvatar :src="i.row.image ? i.row.image : '/images/noimage.png'" />
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
                <UForm :state="stateKos" @submit="onSubmit" class="space-y-4">
                    <ImageUpload :changeImage="changeImageKos" v-model:image="image" v-model:loading="loading" :disabled="mode == 'delete' || stateKos.hidden"/>

                    <UFormGroup label="Nama Kos" name="name" class="w-full">
                        <UInput v-model="stateKos.name" placeholder="nama kos" autocomplete="off" 
                            :disabled="mode == 'delete' || stateKos.hidden" />
                    </UFormGroup>
                    <UFormGroup label="Deskripsi Kos" class="w-full">
                        <UTextarea v-model="stateKos.description" placeholder="deskripsi kos" autocomplete="off"
                            :disabled="mode == 'delete' || stateKos.hidden" />
                    </UFormGroup>
                    <UFormGroup label="Alamat Kos" class="w-full">
                        <UInput v-model="stateKos.address" placeholder="alamat kos" autocomplete="off"
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
const image = ref('')
const q = ref('')
const filter = ref<'aktif' | 'non aktif' | 'all'>('aktif')
const sort = ref<'asc' | 'desc'>('asc')

const columns = [{
    key: 'num',
    label: 'id',
},
{
    key: '_name',
    label: 'kos',
},
{
    key: '_description',
    label: 'deskripsi',
},
{
    key: '_address',
    label: 'alamat',
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

const { data: raw, status, refresh } = await useFetch('/api/kos/get', {
    query,
    method: 'get'
})

const stateKos = reactive({
    name: '',
    description: '',
    address: '',
    _id: '',
    hidden: false
})

const resetState = () => {
    stateKos.name = ''
    stateKos.description = ''
    stateKos.address = ''
    image.value = ''
    stateKos.hidden = false
    stateKos._id = ''
}
const helperState = (e: any) => {
    const { name, description, address, image: _image, _id, hidden } = e
    stateKos.name = name
    stateKos.description = description
    stateKos.address = address
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

watch(page, (e, _) => {    
    // @ts-ignore
    skip.value = (e - 1) * pageCount.value
    refresh()
})

watch([q, sort, filter], (e,_)=>{
    refresh()
})

watch(status, (e, _) => {
    if(e != 'success') return
    
    // @ts-ignore
    const { total, data } = raw.value
    
    totalPage.value = total

    rows.value = data.map((items:any)=>({
        ...items,
        _name: shortWord(items.name, 50), 
        _address: shortWord(items.address, 50), 
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