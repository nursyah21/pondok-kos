<template>
    <div class="flex min-h-screen print:hidden">
        <aside class="flex-col p-8 hidden lg:flex  rounded-lg m-2 shadow-2xl items-center">
            <ULink to="/" class="text-primary font-bold text-2xl flex items-center gap-x-2">
                <UIcon name="i-material-symbols-other-houses" />
                <span class="hidden lg:block">
                    Pondok Jaya
                </span>
            </ULink>
            <div class="mt-8 flex-col flex gap-y-4 lg:gap-y-8">
                <template v-for="i in navbar">
                    <UButton :ui="{ padding: '' }" variant="link" class="text-md hidden lg:block"
                        activeClass="underline" :to="i.link">
                        <div class="flex items-center gap-x-2">
                            <UIcon :name="i.icon" />
                            {{ i.label }}
                        </div>
                    </UButton>
                </template>
            </div>

        </aside>
        <main class="flex-1 pb-12 space-y-6 overflow-y-auto lg:h-screen md:space-y-8">
            <header
                class="flex justify-between lg:justify-end my-2 border-b-2 border-gray-200 dark:border-gray-800 shadow-md p-3 rounded-xl w-full">
                <UButton class="lg:hidden" @click="slide_over = true" fadded="false" variant="link"
                    icon="i-charm-menu-hamburger" />
                <UDropdown v-if="data && (data.avatar ? data.avatar : '/images/profile.png')" :items="[
                    [{
                        label: data.name,
                        avatar: {
                            src: data.avatar ? data.avatar : '/images/profile.png'
                        },
                    }], [
                        {
                            label: 'Edit Profile',
                            class: 'edit-profile',
                            icon: 'i-material-symbols-light-settings',
                            click: () => {
                                // @ts-ignore
                                navigateTo('/dashboard/edit-profile')
                            }
                        },
                        {
                            label: !isDark ? 'Siang' : 'Malam',
                            class: 'tema',
                            icon: isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid',
                            click: () => {
                                isDark = !isDark
                            }
                        },
                        {
                            label: 'Keluar',
                            class: 'keluar',
                            icon: 'i-material-symbols-light-exit-to-app-rounded',
                            click: () => {
                                // @ts-ignore
                                navigateTo('/logout')
                            }
                        }]
                ]" :popper="{ placement: 'bottom-start' }">
                    <UButton data-cy='avatar' variant="link">
                        <UAvatar label="Options" :src="data.avatar ? data.avatar : '/images/profile.png'" alt="Avatar" />
                    </UButton>
                </UDropdown>


                <USlideover side="left" v-model="slide_over" class="lg:hidden">
                    <div class="p-4 flex-1">
                        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                            class="flex absolute end-5 top-5 z-10" square padded @click="slide_over = false" />

                        <div class="flex flex-col gap-y-8 mt-12">
                            <template v-for="i in navbar">
                                <UButton :ui="{ padding: '' }" :icon="i.icon" variant="link" class="text-md "
                                    activeClass="text-primary-600 underline" @click="
                                    {
                                        // @ts-ignore
                                        slide_over = false; navigateTo(i.link)
                                    }">{{ i.label }}</UButton>
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

<style>

.apexcharts-legend-text{
    color: rgb(var(--color-primary-400) / var(--tw-text-opacity)) !important;
}

</style>

<script setup lang="ts">
const data = profile

const _data = await myProfile()
let role = 0
if (_data.data) {
    data.value = _data.data
    role = _data.data.role    
}

const slide_over = ref(false)
const penghuni = [{
    label: 'Dashboard',
    icon: 'i-material-symbols-dashboard',
    link: '/dashboard'
},
{
    label: 'Cari kos',
    icon: 'i-material-symbols-search',
    link: '/dashboard/cari-kos'
},
{
    label: 'Riwayat Transaksi',
    icon: 'i-material-symbols-lab-profile',
    link: '/dashboard/riwayat-transaksi'
},]
const penjaga = [{
    label: 'Dashboard',
    icon: 'i-material-symbols-dashboard',
    link: '/dashboard'
},
{
    label: 'Riwayat Transaksi',
    icon: 'i-material-symbols-lab-profile',
    link: '/dashboard/riwayat-transaksi'
},
{
    label: 'Penghuni',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/penghuni'
},
{
    label: 'Verifikasi Penghuni',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/verifikasi-penghuni'
},
]
const pemilik = [{
    label: 'Dashboard',
    icon: 'i-material-symbols-dashboard',
    link: '/dashboard'
},
{
    label: 'Riwayat Transaksi',
    icon: 'i-material-symbols-lab-profile',
    link: '/dashboard/riwayat-transaksi'
},
{
    label: 'Penghuni',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/penghuni'
},
{
    label: 'Verifikasi Penghuni',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/verifikasi-penghuni'
},
{
    label: 'Penjaga',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/penjaga'
},
{
    label: 'Manajemen User',
    icon: 'i-material-symbols-supervisor-account-rounded',
    link: '/dashboard/manajemen-user'
},
{
    label: 'Unit Kos',
    icon: 'i-material-symbols-home-work-rounded',
    link: '/dashboard/unit-kos'
},
{
    label: 'Kamar Kos',
    icon: 'i-material-symbols-home-work-rounded',
    link: '/dashboard/kamar-kos'
}]

const navbar = role == 0 ? penghuni : role == 1 ? penjaga : pemilik

const midtrans_prod = useRuntimeConfig().public.midtransProduction
const midtransClient = midtrans_prod ? useRuntimeConfig().public.midtransClient : useRuntimeConfig().public.midtransClientSandbox
const midtransLink = midtrans_prod ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js'

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

useHead({
    script: [
        {
            src: midtransLink,
            "data-client-key": midtransClient, // Replace with your key
            async: true, // Ensure the script loads asynchronously
        }]
})


</script>