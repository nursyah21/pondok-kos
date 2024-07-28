<template>

    <Breadcrumb />
    <main class="my-4">
        <div class="flex gap-x-4 gap-y-4 flex-col sm:flex-row">
            <UCard class='text-slate-600 w-[260px] h-[100px]'>
                <UIcon  name="i-material-symbols-supervisor-account-rounded" class="text-primary text-2xl" />
                <div class="flex justify-between items-center">
                    <h1 class="font-bold">User</h1>
                    <UButton to="/dashboard/user/data-user">Buka</UButton>
                </div>
            </UCard>
            <UCard class='text-slate-600 w-[260px] h-[100px]'>
                <UIcon  name="i-material-symbols-supervisor-account-rounded" class="text-primary text-2xl" />
                <div class="flex justify-between items-center">
                    <h1 class="text-primary-600 font-bold">Penjaga</h1>
                    <UButton variant="link" to="/dashboard/user/data-penjaga">Buka</UButton>
                </div>
            </UCard>
        </div>

        
        <UButton @click="add" class="my-4">tambahkan data</UButton>
        <UTable :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #name-data="i">
                <div class="items-center flex gap-x-3">
                    <UAvatar :src="i.row.avatar" />
                    {{ i.row.name }}
                </div>
            </template>

            <template #action-data="i">
            
            <UDropdown  :items="[
                    [{
                        label: 'Edit',
                        icon: 'i-material-symbols-light-edit',
                        click: ()=>edit(i.row)
                    },
                    {
                        label: 'Hapus',
                        icon: 'i-material-symbols-light-delete',
                        click: ()=>del(i.row)
                    }]
                ]" :popper="{ placement: 'bottom-start' }">
                
                <UButton  variant="link" icon="i-mi-options-vertical" />
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
                        <h1 v-if="mode == 'add'" class="font-bold text-slate-600">Tambahkan Penjaga</h1>
                        <h1 v-if="mode == 'edit'" class="font-bold text-slate-600">Edit Penjaga</h1>
                        <h1 v-if="mode == 'delete'" class="font-bold text-slate-600">Hapus Penjaga</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <UFormGroup label="Penjaga" class="w-full">
                        <USelect v-model="state.id_penjaga" :options="optionsPenjaga"  option-attribute="name" autocomplete="off" :disabled="mode == 'edit' || mode =='delete'"/>
                    </UFormGroup>
                    <UFormGroup label="Kos" class="w-full">
                        <USelect v-model="state.id_kos" :options="optionsKos"  option-attribute="name" autocomplete="off" :disabled="mode == 'delete'"/>
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
const mode:Ref<ModeCrud> = ref('add')
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
const pageCount = 10
const skip = ref(0)
const totalPage = ref(0)
const query = computed(() => ({ skip: skip.value, limit: pageCount }))
const { data:raw, status, refresh } = await useFetch('/api/v2/protect/penjaga/all-penjaga-kos', {
    headers:{
        Authorization: `Bearer ${token}`
    },
    query, method: 'post'
})
// @ts-ignore
const {data: allKos} = await $fetch('/api/v2/protect/kos/get',{
    method: 'get'
})
const optionsKos = allKos.map((e:any)=>({value:e._id, name: `${e.name} - ${e.location}`}))

// @ts-ignore
const {data: allPenjaga} = await $fetch('/api/v2/protect/penjaga/all-penjaga',{
    headers:{
        Authorization: `Bearer ${token}`
    }, method: 'post'
})
const optionsPenjaga = allPenjaga.map((e:any)=>({value:e._id, name: `${e.name} - ${e.number_phone}`}))

const state = reactive({
    id_penjaga: optionsPenjaga[0].value,
    id_kos: optionsKos[0].value,
    _id: ''
})

const helperState = (e:any) => {
    const { _id } = e
    state._id = _id
}


const add = (e:any) => {
    isOpen.value = true
    mode.value = 'add'
}

const edit = (e:any) => {
    isOpen.value = true
    mode.value = 'edit'
    helperState(e)
}

const del = (e:any) => {
    isOpen.value = true
    mode.value = 'delete'
    helperState(e)
}

const onSubmit = (e:any) => {
    if(mode.value == 'add'){
        return submitAdd(e)
    }
    if(mode.value == 'edit'){
        return submitEdit(e)
    }
    if(mode.value == 'delete'){
        return submitDelete(e)
    }
}



const submitAdd = (e:any) => submitHelperPost(
    loading, isOpen, 'addPenjaga', '/api/v2/protect/penjaga/add-penjaga',
    refresh, {...e.data}
)

const submitEdit = (e:any) => submitHelperPut(
    loading, isOpen, 'editPenjaga', '/api/v2/protect/penjaga/edit-penjaga',
    refresh, {...e.data}
)

const submitDelete = (e:any) => submitHelperDelete(
    loading, isOpen, 'deletePenjaga', '/api/v2/protect/penjaga/delete-penjaga',
    refresh, {...e.data}
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
        const {total, data} = raw.value
        totalPage.value = total
        rows.value = data
    }
}, { deep: true, immediate: true })


definePageMeta({
    layout: 'dashboard'
})

</script>