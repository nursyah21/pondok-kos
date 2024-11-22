<template>

    <Breadcrumb />
    <main class="my-4">

        <!-- search -->
        <div class="flex sm:flex-row flex-col sm:mr-2 border-b-2 dark:border-gray-800 py-2">

            <div class="flex items-center w-full">
                <!-- <UButton variant='link' color='gray' @click="add" icon="i-material-symbols-add-box" /> -->
                <UInput icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
                    placeholder="Cari nama user" class="w-full" v-model="q"
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

                <UDropdown class="":items="[
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
                <div v-if="i.row.birthdate">
                    {{ i.row.birthdate.split('T')[0] }}
                </div>
                <UBadge color="yellow" v-else>
                    kosong
                </UBadge>
            </template>
            <template #role-data="i">
                <UBadge v-if="i.row.role == 1" color="blue">
                    Penjaga
                </UBadge>
                <UBadge v-if="i.row.role == 0">
                    Penghuni
                </UBadge>
            </template>

            <template #action-data="i">
                <UDropdown :items="[
                    [{
                        label: 'Reset password',
                        icon: 'i-material-symbols-password',
                        click: () => reset(i.row)
                    },
                    {
                        label: 'Ubah role',
                        icon: 'i-material-symbols-person',
                        click: () => change(i.row)
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
                        <h1 v-if="mode == 'verif'" class="font-bold text-slate-600 dark:text-slate-200">Verifikasi</h1>
                        <h1 v-if="mode == 'role'" class="font-bold text-slate-600 dark:text-slate-200">Ubah sebagai
                            penjaga</h1>
                        <h1 v-if="mode == 'reset'" class="font-bold text-slate-600 dark:text-slate-200">Reset Password
                        </h1>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isOpen = false" />
                    </div>
                    <div class="flex justify-center flex-col items-center gap-y-1">
                        <UAvatar size="3xl" :src="avatar" alt="Avatar" />
                        <UBadge :color="state.verified ? 'green' : 'yellow'">
                            {{ state.verified ? 'terverifikasi' : 'belum terverifikasi' }}
                        </UBadge>
                    </div>
                </template>
                <UForm :state="state" @submit="onSubmit" class="space-y-4">
                    <UFormGroup label="Nama" name="name penjaga" class="w-full">
                        <UInput v-model="state.name" placeholder="nama" autocomplete="off" disabled />
                    </UFormGroup>
                    <UFormGroup label="Nomor Whatsapp" name="nomor whatsapp" class="w-full">
                        <UInput v-model="state.number_phone" placeholder="nomor whatsapp" autocomplete="off" disabled />
                    </UFormGroup>
                    <UFormGroup label="Tanggal lahir" name="birth_date" class="w-full">
                        <UInput v-model="state.birthdate" type="date" disabled />
                    </UFormGroup>
                    <UFormGroup label="Alamat asal" name="address" class="w-full">
                        <UInput v-model="state.address" placeholder="Alamat asal" autocomplete="off" disabled />
                    </UFormGroup>

                    <img v-show="id_card && id_card != '#'" :src="id_card" alt="id card penjaga"
                        class="w-[200px] h-[200px] ">

                    <UFormGroup v-if="resetPassword" label="Link Reset Password" name="address" class="w-full">
                        <ULink class="text-xs text-primary hover:text-primary-600 hover:underline" :to="resetPassword">
                            {{
                            resetPassword }}</ULink>
                    </UFormGroup>

                    <UInput class="hidden" v-model="state.user_id" />
                    <UFormGroup v-if="mode == 'verif'">
                        <UButton :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            Verif
                        </UButton>
                    </UFormGroup>
                    <UFormGroup v-if="mode == 'role'">
                        <UButton :color="state.role == 0 ? 'blue' : 'green'" :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            Ubah ke {{ state.role == 0 ? 'penjaga' : 'penghuni' }}
                        </UButton>
                    </UFormGroup>
                    <UFormGroup v-if="mode == 'reset'">
                        <UButton :loading="loading" type="submit"
                            class="w-full text-center items-center justify-center">
                            Reset Password
                        </UButton>
                    </UFormGroup>
                </UForm>

            </UCard>
        </UModal>


    </main>
</template>

<script setup lang="ts">

// @ts-ignore
const { role } = profile.value
const rows = ref([])
const isOpen = ref(false)
type Mode = 'role' | 'verif' | 'reset'

const mode: Ref<Mode> = ref('role')
const loading = ref(false)

const columns = [{
    key: 'num',
    label: 'id'
},
{
    key: 'name',
    label: 'nama'
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
    key: 'role',
    label: 'role'
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
const filter = ref<'aktif' | 'non aktif' | 'all'>('aktif')
const q = ref('')
const sort = ref<'asc' | 'desc'>('asc')
const query = computed(() => ({ 
    skip: skip.value, 
    limit: pageCount.value == -1 ? pageCount.value * totalPage.value : pageCount.value,
    filter: filter.value,
    sort: sort.value,
    q: q.value,
}))
const { data: raw, status, refresh } = await useFetch('/api/all-user', {
    headers: {
        Authorization: `Bearer ${token}`
    },
    query, method: 'get'
})


const state = reactive({
    name: '',
    number_phone: '',
    birthdate: '',
    address: '',
    verified: '',
    user_id: '',
    role: 0
})
const avatar = ref('')
const id_card = ref('')
const resetPassword = ref('')


const helperState = (e: any) => {
    const { id, name, number_phone, avatar: _avatar, id_card: _id_card, address, birthdate, role } = e
    state.user_id = id
    state.name = name
    state.number_phone = number_phone
    if (_avatar) {
        avatar.value = _avatar
    }
    if (_id_card) {
        id_card.value = _id_card
    }
    state.address = address
    state.birthdate = birthdate ? birthdate.split('T')[0] : ''
    resetPassword.value = ''
    state.role = role
}


const change = (e: any) => {
    isOpen.value = true
    mode.value = 'role'
    helperState(e)
}

const reset = (e: any) => {
    isOpen.value = true
    mode.value = 'reset'
    helperState(e)
}

const onSubmit = (e: any) => {
    if (mode.value == 'role') {
        return submitRole(e.data)
    }
    if (mode.value == 'reset') {
        return submitReset(e.data)
    }
}

const submitRole = async (e: any) => {
    await submitHelperPut(
        loading, isOpen, 'resetPassword', '/api/change-role',
        refresh, { id: e.user_id, role: e.role }
    )
}

const submitReset = async (e: any) => {
    const res = await submitHelperPost(
        loading, ref(false), 'changeRole', '/api/reset-password/generate',
        refresh, { number_phone: e.number_phone }
    )
    if (res.status == 'success') {
        resetPassword.value = res.link
    }
}


watch(page, (e, _) => {    
    // @ts-ignore
    skip.value = (e - 1) * pageCount.value
    refresh()
})
// watch(() => useRoute().query,
//     (e) => {
//         // @ts-ignore
//         skip.value = (e['page'] - 1) * pageCount
//         refresh()
//     }, { deep: true })

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
    title: 'Manajemen User'
})
</script>