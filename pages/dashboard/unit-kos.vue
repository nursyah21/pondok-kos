<template>

    <Breadcrumb />
    <main class="my-4">
        <RefreshButton :refresh="refresh" v-model:status="status" />
        
        <UButton @click="add" class="my-4">tambahkan data</UButton>
        <UTable :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #name-data="i">
                <div v-if="i.row.hidden" class="flex items-center gap-x-4 text-opacity-70">
                    {{i.row.name}}
                    <UBadge color="yellow">tidak aktif</UBadge>
                </div>
                <div v-else class="flex items-center gap-x-4 text-">
                    <UAvatar :src="i.row.image" />
                    {{i.row.name}}
                </div>
            </template>
            <template #action-data="i">
                <UDropdown :items="[
                    [{
                        label: 'Edit',
                        icon: 'i-material-symbols-light-edit',
                        click: ()=>edit(i.row)
                    },
                    {
                        label: 'Ubah status',
                        icon: 'i-material-symbols-light-edit',
                        click: ()=>hidden(i.row)
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
                <UForm :state="stateKos" @submit="onSubmit" class="space-y-4">
                    <div class="flex justify-center">
                        <img v-if="image" :src="image" alt="image kos" class="w-[200px] h-[200px] ">
                    </div>
                    <UFormGroup label="Nama Kos" name="name" class="w-full">
                        <UInput v-model="stateKos.name" placeholder="nama kos" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Deskripsi Kos" name="deskripsi" class="w-full">
                        <UInput v-model="stateKos.description" placeholder="deskripsi kos" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Lokasi Kos" name="deskripsi" class="w-full">
                        <UInput v-model="stateKos.location" placeholder="lokasi kos" autocomplete="off"
                            :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Foto kos" name="poto_kos" class="w-full">
                        <UInput type="file" icon="i-heroicons-folder" accept="image/*" @change="changeImageKos"
                            :disabled="mode == 'delete'" />
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
                        <UButton v-else :color="mode == 'delete' ? 'yellow' : 'green'" :loading="loading" type="submit"
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
    label: 'nama kos',
},
{
    key: 'description',
    label: 'deskripsi kos',
},
{
    key: 'location',
    label: 'lokasi',
},
{
    key: 'action',
    label: 'aksi',
},
]

const page = ref(1)
const pageCount = 10
const skip = ref(0)
const totalPage = ref(0)
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


const changeImageKos = (e: any) => uploadFile(e, loading, image)

watch(() => useRoute().query,
    (e) => {
        // @ts-ignore
        skip.value = (e['page'] - 1) * pageCount
        refresh()
    }, { deep: true })

watch(() => status, (e) => {
    if (e.value == 'success') {
        // @ts-ignore
        const { data } = raw.value
        rows.value = data
    }
}, { deep: true })


definePageMeta({
    layout: 'dashboard'
})

</script>