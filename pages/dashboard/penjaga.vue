<template>

    <Breadcrumb />
    <main class="my-4">
        <!-- search -->
        <div class="flex sm:flex-row flex-col sm:mr-2 border-b-2 dark:border-gray-800 py-2">

            <div class="flex items-center w-full">
                <UButton variant='link' color='gray' @click="add" icon="i-material-symbols-add-box" />
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    placeholder="Cari nama penjaga" class="w-full" v-model="q"
                    :ui="{ icon: { trailing: { pointer: '' } } }">
                    <template #trailing>
                        <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid"
                            :padded="false" @click="q = ''" />
                    </template>
                </UInput>
            </div>
            <div class="flex mt-2 sm:mt-0">
                <!-- <UDropdown :items="[
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
    </UDropdown> -->

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
            <template #name-data="i">
                <div class="items-center flex gap-x-3">
                    <UAvatar :src="i.row.avatar" />
                    {{ i.row.name }}
                </div>
            </template>

            <template #action-data="i">

                <UDropdown :items="[
                    [{
                        label: 'Edit',
                        icon: 'i-material-symbols-light-edit',
                        click: () => edit(i.row)
                    },
                    {
                        label: 'Hapus',
                        icon: 'i-material-symbols-light-delete',
                        click: () => del(i.row)
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
                        <h1 v-if="mode == 'add'" class="font-bold text-slate-600 dark:text-slate-200">Tambahkan Penjaga
                        </h1>
                        <h1 v-if="mode == 'edit'" class="font-bold text-slate-600 dark:text-slate-200">Edit Penjaga</h1>
                        <h1 v-if="mode == 'delete'" class="font-bold text-slate-600 dark:text-slate-200">Hapus Penjaga
                        </h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <UFormGroup label="Penjaga" class="w-full">
                        <USelect v-model="state.id_penjaga" :options="optionsPenjaga" option-attribute="name"
                            autocomplete="off" :disabled="mode == 'edit' || mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Kos" class="w-full">
                        <USelect v-model="state.id_kos" :options="optionsKos" option-attribute="name" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup>
                        <UButton :color="mode == 'delete' ? 'red' : 'green'" :loading="loading" type="submit"
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

const rows = ref([])
const isOpen = ref(false)
const mode: Ref<ModeCrud> = ref('add')
const loading = ref(false)

const columns = [{
    key: 'num',
    label: 'id',
},
{
    key: 'name',
    label: 'nama penjaga',
},
{
    key: 'number_phone',
    label: 'nomor whatsapp',
},
{
    key: 'kos',
    label: 'nama kos',
},
{
    key: 'location',
    label: 'lokasi kos',
},
{
    key: 'action',
    label: 'aksi',
},
]

const page = ref(1)
const pageCount = ref(5)
const skip = ref(0)
const totalPage = ref(0)
const q = ref('')
const sort = ref<'asc' | 'desc'>('asc')
const query = computed(() => ({
    skip: skip.value,
    limit: pageCount.value == -1 ? pageCount.value * totalPage.value : pageCount.value,
    // filter: filter.value,
    sort: sort.value,
    q: q.value,
}))
const { data: raw, status, refresh } = await useFetch('/api/penjaga/all-penjaga', {
    headers: {
        Authorization: `Bearer ${token}`
    },
    query, method: 'get'
})
// @ts-ignore
const { data: allKos } = await $fetch('/api/kos/get', {
    method: 'get'
})
console.log("=>", allKos)
const optionsKos = allKos.map((e: any) => ({ value: e._id, name: `${e.name} - ${e.address}` }))

// @ts-ignore
const { data: allPenjaga } = await $fetch('/api/penjaga/all-penjaga', {
    headers: {
        Authorization: `Bearer ${token}`
    }, method: 'get'
})
const optionsPenjaga = allPenjaga.map((e: any) => ({ value: e._id, name: `${e.name} - ${e.number_phone}` }))

const state = reactive({
    id_penjaga: optionsPenjaga[0].value,
    id_kos: optionsKos[0]?.value,
    _id: ''
})

const helperState = (e: any) => {
    const { _id } = e
    state._id = _id
}


const add = (e: any) => {
    isOpen.value = true
    mode.value = 'add'
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
    if (mode.value == 'add') {
        return submitAdd(e)
    }
    if (mode.value == 'edit') {
        return submitEdit(e)
    }
    if (mode.value == 'delete') {
        return submitDelete(e)
    }
}



const submitAdd = (e: any) => submitHelperPost(
    loading, isOpen, 'addPenjaga', '/api/penjaga/add-penjaga',
    refresh, { ...e.data }
)

const submitEdit = (e: any) => submitHelperPut(
    loading, isOpen, 'editPenjaga', '/api/penjaga/edit-penjaga',
    refresh, { ...e.data }
)

const submitDelete = (e: any) => submitHelperDelete(
    loading, isOpen, 'deletePenjaga', '/api/penjaga/delete-penjaga',
    refresh, { ...e.data }
)


watch(() => useRoute().query,
    (e) => {
        // @ts-ignore
        skip.value = (e['page'] - 1) * pageCount
        refresh()
    }, { deep: true })

watch(() => status, (e) => {
    if (e.value == 'success') {
        // @ts-ignore
        const { total, data } = raw.value
        totalPage.value = total
        rows.value = data
    }
}, { deep: true, immediate: true })


definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Penjaga'
})
</script>