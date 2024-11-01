<template>

    <Breadcrumb />
    <main class="my-4">
        <div class="flex flex-col gap-y-4">
            <div>
                <h1 class="font-bold">{{ today }}</h1>
                <UButton variant="ghost" @click="refresh" color='gray' :class="status == 'pending' ? 'animate-pulseOpacity' : ''">
                    Hi {{ name }} 👋
                </UButton>
            </div>

            <Admin v-if="role == 2" :status="status" :dashboard="dashboard" />
            <Penjaga v-if="role == 1" :status="status" :dashboard="dashboard" />
            <Penghuni v-if="role == 0" :status="status" :dashboard="dashboard" />

            <AlertNotVerified :verified="verified"  :role="role"/>


        </div>
    </main>
</template>

<script setup lang="ts">
const _data = await myProfile()

let role = 0
let verified = false
if (_data.data) {
    role = _data.data.role
    verified = _data.data.verified
}

// init data
const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
})
let name: string | undefined;
if (profile) {
    name = profile.value?.name
}
const dashboard = ref<DataDashboard>({
    totalPenghuni: "0",
    totalPenjaga: "0",
    totalKamarKos: "0",
    pendapatan: 0,
    chartPiePenghuni: {
        options: null,
        series: null
    },
    chartBarPendapatan: {
        options: null,
        series: null
    },
    chartLineTransaksi: {
        options: null,
        series: null
    }
})
const { data: dataDashboard, status, refresh } = await useFetch('/api/dashboard', {
    headers: {
         Authorization: `Bearer ${token}`
    }
})

watch(() => status, e => {
    if (e.value == 'success') {
        // @ts-ignore
        const { data } = dataDashboard.value
        dashboard.value = data
    }
}, { deep: true, immediate: true })

definePageMeta({
    layout: 'dashboard',
})
useHead({
    title: 'Dashboard'
})
</script>