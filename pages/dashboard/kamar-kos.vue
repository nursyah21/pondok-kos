<template>

    <Breadcrumb />
    <main class="my-4">

        <RefreshButton :refresh="refresh" v-model:status="status" />
        
        <UButton @click="add" class="my-4" :disabled="optionsKos.length == 0">tambahkan data</UButton>
        
        <UTable :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #kos-data="i">
                <div class="flex items-center gap-x-4 text-">
                    <UAvatar :src="i.row.image[0]" />
                    {{i.row.kos}}
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
                        click: ()=>edit(i.row)
                    },
                    {
                        label: 'Ubah status',
                        icon: 'i-material-symbols-light-edit',
                        click: ()=>del(i.row)
                    }]
                ]" :popper="{ placement: 'bottom-start' }">                
                <UButton  variant="link" icon="i-mi-options-vertical" />
            </UDropdown>
            <UDropdown v-else :items="[
                    [{
                        label: 'Edit',
                        icon: 'i-material-symbols-light-edit',
                        click: ()=>edit(i.row)
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
                        <h1 v-if="mode == 'add'" class="font-bold text-slate-600">Tambahkan Kos</h1>
                        <h1 v-if="mode == 'edit'" class="font-bold text-slate-600">Edit Kos</h1>
                        <h1 v-if="mode == 'delete'" class="font-bold text-slate-600">Status Kos</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                </template>
                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <img :src="image ? image : '/images/noimage.png'" alt="image kos" class="w-[200px] h-[200px] ">
                    <!-- <div class="flex justify-center">
                    </div> -->
                    <UFormGroup label="Kos" class="w-full">
                        <USelect v-model="state.id_kos" :options="optionsKos" required option-attribute="name" autocomplete="off" :disabled="mode == 'delete'"/>
                    </UFormGroup>
                    <UFormGroup label="Nama Kamar Kos" name="name" class="w-full">
                        <UInput v-model="state.name" placeholder="nama kos" autocomplete="off" required :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup label="Deskripsi Kamar Kos" name="deskripsi" class="w-full">
                        <UInput v-model="state.description" placeholder="deskripsi kos" autocomplete="off" required :disabled="mode == 'delete'" />
                    </UFormGroup>
                    <UFormGroup :label="'Harga Kamar Kos'" name="harga" class="w-full">
                        <div class="flex items-center gap-x-2 ">
                            <UInput class="flex-1" type="number" max="10000000" min="10000" v-model="state.price" placeholder="harga kamar kos" autocomplete="off" required :disabled="mode == 'delete'"/>
                            <!-- <p class="font-bold w-[100px]">{{formatRupiahIntl(state.price)}}</p> -->
                        </div>
                    </UFormGroup>

                    <UCard v-if="imageKos && imageKos.length" class="flex justify-center">
                        <UCarousel v-slot="{ item }" :items="imageKos" class="mt-2">       
                            <div class="relative mr-2 ">
                                <UButton icon="i-material-symbols-cancel-rounded" size="xs" color="red" 
                                class="absolute top-0 right-0 z-10 " @click="deleteImageKos(item)"/>
                                <img :src="item" width="300" height="300" class="h-[200px]" draggable="false" >
                            </div>
                        </UCarousel>                        
                    </UCard>
                    <UFormGroup label="Foto kamar kos" name="poto_kos" class="w-full">
                        <UInput type="file" icon="i-heroicons-folder" accept="image/*" @change="changeImageKos" :disabled="mode == 'delete'" />
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
const rows = ref([])
const isOpen = ref(false)
const mode:Ref<ModeCrud> = ref('add')
const loading = ref(false)

const imageKos = ref<[string]>()

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

const page = ref(1)
const pageCount = 10
const skip = ref(0)
const totalPage = ref(0)
const query = computed(() => ({ skip: skip.value, limit: pageCount }))
// @ts-ignore
const {data: kos} = await $fetch('/api/kos/get', {    
    method: 'get'
})
// @ts-ignore
const optionsKos = kos.map(e=>({value:e._id, name: `${e.name} - ${e.location}`}))

const { data:raw, status, refresh } = await useFetch('/api/kamar-kos/all-kamar-kos', {
    query,
    method: 'get'
})
if(status.value == 'success'){
    // @ts-ignore
    const {total, data} = raw.value
    totalPage.value = total
    rows.value = data
}

const optionsAvailable = ['tersedia', 'tidak tersedia']
const state = reactive({
    id_kos: optionsKos.length ? optionsKos[0].value : '',
    name: '',
    description: '',
    available: optionsAvailable[0], 
    price: 0,
    hidden: false,
    _id: ''
})
const image = ref('')

const resetState = () => {
    state.name = ''
    state.description = ''
    state.available = optionsAvailable[0], 
    state.price = 0,
    state.id_kos = optionsKos.length ? optionsKos[0].value : '',
    image.value = ''
    state._id = ''
    // @ts-ignore
    imageKos.value = []
}
const helperState = (e:any) => {
    const { name, description, available, price, image: _image, id, id_kos, hidden } = e
    state.name = name
    state.description = description
    state.available = available == 2 ? optionsAvailable[1] : optionsAvailable[1]
    state.price = price
    state.id_kos = optionsKos.find((e:any)=>e.value == id_kos).value
    state.hidden = hidden
    
    if(_image){
        console.log(_image)
        image.value = _image
        imageKos.value = _image
    }
    state._id = id
}


const add = (e:any) => {
    isOpen.value = true
    mode.value = 'add'
    resetState()
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
    return mode.value == 'add' ? submitAddKos(e) 
    : mode.value == 'edit' ? submitEditKos (e)
    : submitDeleteKos(e)
}

const submitEditKos = (e:any) => submitHelperPut(
    loading, isOpen, 'merubah kos', '/api/kamar-kos/edit',
    refresh, {...e.data, image: imageKos.value}
)

const submitAddKos = (e:any) => submitHelperPost(
    loading, isOpen, 'menambah kos', '/api/kamar-kos/add',
    refresh, {...e.data, image: imageKos.value}
)

const submitDeleteKos = (e:any) => submitHelperPost(
    loading, isOpen, 'menghapus kos', '/api/kamar-kos/update-hidden',
    refresh, {...e.data, image: imageKos.value}
)

const deleteImageKos = async (e:any) => {
    // @ts-ignore
    imageKos.value = imageKos.value?.filter((img:any) => img != e)
}

const changeImageKos = async (e:any) => {
    const res = await uploadFile(e, loading, image, 'add')
    // @ts-ignore
    if(imageKos.value){
        // @ts-ignore
        imageKos.value = [...imageKos.value, res]
    }else{
        // @ts-ignore
        imageKos.value = [res]
    }
}

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

useHead({
    title: 'Kamar Kos'
})
</script>