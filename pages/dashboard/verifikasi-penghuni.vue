<template>

    <Breadcrumb />
    <main class="my-4">

        <UTable class="my-4" :loading="status != 'success'" :rows="rows" :columns="columns">
            <template #name-data="i">
                <div class="items-center flex gap-x-3">
                    <UAvatar :src="i.row.avatar" />
                    {{ i.row.name }}
                </div>
            </template>

            <template #address-data="i">
                <div v-if="i.row.address">
                    {{ i.row.address }}
                </div>
                <UBadge color="yellow" v-else>
                    kosong
                </UBadge>
            </template>

            <template #birthdate-data="i">
                <div v-if="i.row.address">
                    {{ i.row.birthdate.split('T')[0] }}
                </div>
                <UBadge color="yellow" v-else>
                    kosong
                </UBadge>
            </template>

            <template #verified-data="i">
                <UBadge :color="i.row.verified ? 'green' : 'red'">
                    {{ i.row.verified ? 'sudah' : 'belum' }}
                </UBadge>
            </template>

            <template #action-data="i">
                <UDropdown  :items="[
                    [{
                        label: 'Verifikasi penghuni',
                        icon: 'i-material-symbols-light-edit',
                        click: ()=>edit(i.row.id)
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

        <UModal v-model="isOpen">
            <UCard>
                <template #header>
                    <div class="items-center justify-between flex">
                        <h1 class="font-bold text-slate-600">Verifikasi Penghuni</h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
                    </div>
                </template>
                <div class="flex justify-center flex-col items-center gap-y-1">
                    <UAvatar size="3xl" :src="state.avatar" alt="Avatar" />

                    <UBadge :color="state.verified ? 'green': 'red'">
                        {{state.verified ? 'terverifikasi' : 'belum terverifikasi'}}</UBadge>
                </div>

            <UForm :state="state" @submit="verifikasi" class="space-y-4" enctype="multipart/form-data">
                <UFormGroup label="Nama lengkap" name="name" class="w-full">
                    <UInput v-model="state.name" placeholder="nama lengkap" autocomplete="off" disabled/>
                </UFormGroup>
                <UFormGroup label="Nomor whatsapp" name="number_phone" class="w-full">
                    <UInput v-model="state.number_phone" placeholder="nomor whatsapp" autocomplete="off" disabled/>
                </UFormGroup>
                <UFormGroup label="Tanggal lahir" name="birth_date" class="w-full">
                    <UInput v-model="state.birthdate" type="date" disabled/>
                </UFormGroup>
                <UFormGroup label="Alamat asal" name="address" class="w-full">
                    <UInput v-model="state.address" placeholder="Alamat asal" autocomplete="off" disabled/>
                </UFormGroup>

                <UFormGroup v-if="id_card && id_card != '#'" label="Kartu identitas">
                    <img :src="id_card" alt="kartu identitas" class="w-[200px] h-[200px] ">
                </UFormGroup>
                
                <UFormGroup class="gap-y-2">
                    <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center bg-red-600 hover:bg-red-700 " v-if="state.verified">
                        Batalkan Verifikasi
                    </UButton>
                    <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center" v-else>
                        Verifikasi
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
const pageCount = 10
const skip = ref(0)
const rows = ref([])
const totalPage = ref(0)
const isOpen = ref(false)
const id = ref('')

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
    key: 'address',
    label: 'alamat',
},
{
    key: 'birthdate',
    label: 'tanggal lahir',
},
{
    key: 'verified',
    label: 'terverifikasi',
},
{
    key: 'action',
    label: 'aksi',
},
]

const state = reactive({
    name: '',
    number_phone: '',
    birthdate: '',
    address: '',
    avatar: '',
    id_card: '',
    verified: ''
})
const id_card = ref('')

const loading = ref(false)

const query = computed(() => ({ skip: skip.value, limit: pageCount }))

const { data: raw, status, refresh } = await useFetch('/api/penghuni/all-penghuni', {
    headers:{
          Authorization: `Bearer ${token}`
    },
    query,method: 'get'
})

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
}, { deep: true, immediate:true })

async function edit(data:any){
    isOpen.value = true
    
    id.value = data
    const query = computed(() => ({ user_id: data }))
    const user = await $fetch('/api/penghuni/penghuni-user', {
        headers:{
          Authorization: `Bearer ${token}`
        },
        query, method: 'get'
    })
    
    // @ts-ignore
    const {name, address, avatar: _avatar, birthdate, number_phone, id_card: _id_card, verified} = user.data
    
    state.name = name
    state.address = address
    if(_avatar){
        state.avatar = _avatar
    }
    if(birthdate){
        // @ts-ignore
        state.birthdate = birthdate.split('T')[0]
    }
    state.number_phone = number_phone
    if(_id_card){
        id_card.value = _id_card
    }
    state.verified = verified
    loading.value = false
}

async function verifikasi(){
    loading.value = true
    
    await $fetch('/api/penghuni/penghuni-verified', {
        headers:{
          Authorization: `Bearer ${token}`
        },
        method: 'post', body: {user_id: id.value, verified: !state.verified}
    })
    loading.value = false
    isOpen.value = false
    refresh()
}

useHead({
    title: 'Verifikasi Penghuni'
})

</script>