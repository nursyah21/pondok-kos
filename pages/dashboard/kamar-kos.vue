<template>

    <Breadcrumb />
    <main class="my-4">

        <!-- search -->
        <div class="flex sm:flex-row flex-col sm:mr-2 border-b-2 py-2">

            <div class="flex items-center w-full">
                <UButton variant='link' color='gray' @click="add" icon="i-material-symbols-add-box" />
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
                        label: 'tersedia',
                        class: filter == 'tersedia' ? 'underline' : '',
                        click: () => { filter = 'tersedia' }
                    },
                    {
                        label: 'tidak tersedia',
                        class: filter == 'tidak tersedia' ? 'underline' : '',
                        click: () => { filter = 'tidak tersedia' }
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
            <template #kos-data="i">
                <div class="flex items-center gap-x-4 text-">
                    <UAvatar :src="i.row.image[0]" />
                    {{ i.row.kos }}
                </div>
            </template>

            <template #available-data="i">
                <template v-if="i.row.hidden">
                    <UBadge color="gray">tidak aktif</UBadge>
                </template>
                <template v-else>
                    <UBadge v-if="i.row.available == 0">tersedia</UBadge>
                    <UBadge color="yellow" v-if="i.row.available == 1">sedang dipesan</UBadge>
                    <UBadge color="red" v-if="i.row.available == 2">ditempati</UBadge>
                </template>
            </template>

            <template #action-data="i">
                <UDropdown v-if="i.row.available == 0" :items="[
                    [{
                        label: 'Edit',
                        icon: 'i-material-symbols-light-edit',
                        click: () => edit(i.row)
                    },
                    {
                        label: 'Ubah status',
                        icon: 'i-material-symbols-light-edit',
                        click: () => del(i.row)
                    }]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-mi-options-vertical" />
                </UDropdown>
                <UDropdown v-else :items="[
                    [{
                        label: 'Edit',
                        icon: 'i-material-symbols-light-edit',
                        click: () => edit(i.row)
                    }]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link" icon="i-mi-options-vertical" />
                </UDropdown>
            </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
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
                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <!-- <img :src="image ? image : '/images/noimage.png'" alt="image kos" class="w-[200px] h-[200px] "> -->

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
                        <USelect v-model="state.id_kos" :options="optionsKos" required option-attribute="name"
                            autocomplete="off" :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Nama Kamar Kos" name="name" class="w-full">
                        <UInput v-model="state.name" placeholder="nama kos" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Deskripsi Kamar Kos" name="deskripsi" class="w-full">
                        <UInput v-model="state.description" placeholder="deskripsi kos" autocomplete="off"
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
const filter = ref<'tersedia' | 'tidak tersedia' | 'all'>('all')
const sort = ref<'asc' | 'desc'>('asc')

const loading = ref(false)
const imageKos = ref<[string]>([''])

const columns = [{
    key: 'num',
    label: 'id',
},
{
    key: 'kos',
    label: 'kos',
},
{
    key: 'name',
    label: 'kamar',
},
{
    key: 'description',
    label: 'deskripsi',
},
{
    key: 'available',
    label: 'tersedia',
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

const query = computed(() => ({
    skip: skip.value,
    limit: pageCount.value == -1 ? pageCount.value * totalPage.value : pageCount.value,
    filter: filter.value,
    sort: sort.value,
    q: q.value,
}))

// @ts-ignore
const { data: kos } = await $fetch('/api/kos/get', {
    method: 'get'
})
// @ts-ignore
const optionsKos = kos.map(e => ({ value: e._id, name: `${e.name} - ${e.location}` }))

const { data: raw, status, refresh } = await useFetch('/api/kamar-kos/all-kamar-kos', {
    query,
    method: 'get'
})

const optionsAvailable = ['tersedia', 'tidak tersedia']

const state = reactive({
    id_kos: optionsKos.length ? optionsKos[0].value : '',
    name: '',
    description: '',
    available: optionsAvailable[0],
    price: '0',
    hidden: false,
    _id: ''
})

const image = ref('')

const resetState = () => {
    state.name = ''
    state.description = ''
    state.available = optionsAvailable[0],
        state.price = '0',
        state.id_kos = optionsKos.length ? optionsKos[0].value : '',
        image.value = ''
    state._id = ''
    // @ts-ignore
    imageKos.value = []
}
const helperState = (e: any) => {
    const { name, description, available, price, image: _image, id, id_kos, hidden } = e
    state.name = name
    state.description = description
    state.available = available == 2 ? optionsAvailable[1] : optionsAvailable[1]
    state.price = price
    state.id_kos = optionsKos.find((e: any) => e.value == id_kos).value
    state.hidden = hidden

    if (_image) {
        console.log(_image)
        image.value = _image
        imageKos.value = _image
    }
    state._id = id
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

const deleteImageKos = async (e: any) => {
    // @ts-ignore
    imageKos.value = imageKos.value?.filter((img: any) => img != e)
}


const changeImageKos = async (e: any) => {
    const res = await uploadFile(e, loading, image, 'add')
    // @ts-ignore
    if (imageKos.value) {
        // @ts-ignore
        imageKos.value = [...imageKos.value, res]
    } else {
        // @ts-ignore
        imageKos.value = [res]
    }
}

watch([q, sort, filter], (e, _) => {
    refresh()
}, { deep: true })

watch(status, (e, _) => {
    if (e != 'success') return

    // @ts-ignore
    const { total, data } = raw.value

    totalPage.value = total
    rows.value = data
}, { immediate: true })

watch([state], (e, _) => {
    e[0].price = formatRupiahIntl(e[0].price, false)
})


definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Kamar Kos'
})
</script>