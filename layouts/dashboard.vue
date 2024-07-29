<template>
    <div class="flex min-h-screen print:hidden">
        <aside class="flex-col p-8 hidden sm:flex  rounded-lg m-2 shadow-2xl items-center">
            <ULink to="/" class="text-primary font-bold text-2xl flex items-center gap-x-2">
                <UIcon name="i-material-symbols-other-houses" />
                <span class="hidden lg:block">
                    Pondok Jaya
                </span>
            </ULink>
            <div class="mt-8 flex-col flex gap-y-8 lg:gap-y-12">
                <template v-for="i in navbar">
                    <UButton :ui="{ padding: '' }" :icon="i.icon" variant="link" class="text-md hidden lg:block"
                        :to="i.link">{{ i.label }}</UButton>
                    <UButton :ui="{ padding: '' }" :icon="i.icon" variant="link" class="text-md block lg:hidden"
                        :to="i.link" />
                </template>
            </div>

        </aside>
        <main class="flex-1 pb-12 space-y-6 overflow-y-auto lg:h-screen md:space-y-8">
            <header
                class="flex justify-between sm:justify-end my-2 border-b-2 border-gray-200 shadow-md p-3 rounded-xl w-full">
                <UButton class="sm:hidden" @click="slide_over = true" fadded="false" variant="link"
                    icon="i-charm-menu-hamburger" />


                <UDropdown v-if="data && data.avatar"  :items="[
                        [{
                            label: data.name,
                            avatar: {
                                src: data.avatar
                            }
                        }], [
                            {
                                label: 'Edit Profile',
                                icon: 'i-material-symbols-light-settings',
                                click: () => {
                                    navigateTo('/dashboard/settings')
                                }
                            },
                            {
                                label: 'Keluar',
                                icon: 'i-material-symbols-light-exit-to-app-rounded',
                                click: () => {
                                    console.log('/dashboard doing logout')
                                    navigateTo('/logout')
                                }
                            }]
                    ]" :popper="{ placement: 'bottom-start' }">
                    <UButton variant="link">
                        <UAvatar label="Options" :src="data.avatar" alt="Avatar" />
                    </UButton>
                </UDropdown>


                <USlideover side="left" v-model="slide_over" class="sm:hidden">
                    <div class="p-4 flex-1">
                        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                            class="flex absolute end-5 top-5 z-10" square padded @click="slide_over = false" />

                        <div class="flex flex-col gap-y-8 mt-12">
                            <template v-for="i in navbar">
                                <UButton :ui="{ padding: '' }" :icon="i.icon" variant="link" class="text-md "
                                    activeClass="text-primary-600 underline"
                                    @click="slide_over = false; navigateTo(i.link)">{{ i.label }}</UButton>
                            </template>
                        </div>
                    </div>
                </USlideover>
            </header>
            <UContainer class="my-2">
                <slot></slot>
            </UContainer>
        </main>
    </div>
</template>

<script setup lang="ts">
const data = profile

const _data = await myProfile()
let role = 0
if(_data.data) {
    data.value = _data.data
    role = _data.data.role
    // make pseudo avatar
    if(!data.value.avatar){
        data.value = {...data.value, avatar: '#'}
    }
}

const slide_over = ref(false)
const penghuni = [{
    label: 'Beranda',
    icon: 'i-material-symbols-dashboard',
    link: '/dashboard'
},
// {
//     label: 'Pesan',
//     icon: 'i-material-symbols-chat-bubble',
//     link: '/dashboard/messages'
// },
{
    label: 'Cari kos',
    icon: 'i-material-symbols-search',
    link: '/dashboard/find-kos'
},
{
    label: 'Riwayat transaksi',
    icon: 'i-material-symbols-lab-profile',
    link: '/dashboard/transaksi'
},]
const penjaga = [{
    label: 'Beranda',
    icon: 'i-material-symbols-dashboard',
    link: '/dashboard'
},
{
    label: 'Riwayat transaksi',
    icon: 'i-material-symbols-lab-profile',
    link: '/dashboard/transaksi'
},
{
    label: 'Penghuni',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/penghuni'
},
// {
//     label: 'Manajemen user',
//     icon: 'i-material-symbols-supervisor-account-rounded',
//     link: '/dashboard/user'
// },
// {
//     label: 'Manajemen kos',
//     icon: 'i-material-symbols-home-work-rounded',
//     link: '/dashboard/kos'
// }
]
const pemilik = [{
    label: 'Beranda',
    icon: 'i-material-symbols-dashboard',
    link: '/dashboard'
},
{
    label: 'Riwayat transaksi',
    icon: 'i-material-symbols-lab-profile',
    link: '/dashboard/transaksi'
},
{
    label: 'Penghuni',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/penghuni'
},
{
    label: 'Manajemen user',
    icon: 'i-material-symbols-manage-accounts-rounded',
    link: '/dashboard/user'
},
{
    label: 'Manajemen kos',
    icon: 'i-material-symbols-home-work-rounded',
    link: '/dashboard/kos'
}]

const navbar = role == 0 ? penghuni : role == 1 ? penjaga : pemilik

const midtrans_prod = useRuntimeConfig().public.midtransProduction
const midtransClient = midtrans_prod ? useRuntimeConfig().public.midtransClient : useRuntimeConfig().public.midtransClientSandbox
const midtransLink = midtrans_prod ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js'

useHead({
    script: [
    {
      src: midtransLink,
      "data-client-key": midtransClient, // Replace with your key
      async: true, // Ensure the script loads asynchronously
    }]
})


</script>