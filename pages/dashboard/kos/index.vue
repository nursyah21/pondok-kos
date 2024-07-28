<template>

    <Breadcrumb />
    <main class="my-4">
        <div class="flex gap-x-4 gap-y-4 flex-col sm:flex-row">
            <UCard class='text-slate-600 w-[260px] h-[100px]'>
                <UIcon  name="i-material-symbols-home-work-rounded" class="text-primary text-2xl" />
                <div class="flex justify-between items-center">
                    <h1 class="font-bold">Kos</h1>
                    <UButton  to="/dashboard/kos/data-kos">Buka</UButton>
                </div>
            </UCard>
            <UCard class='text-slate-600 w-[260px] h-[100px]'>
                <UIcon  name="i-material-symbols-home-work-rounded" class="text-primary text-2xl" />
                <div class="flex justify-between items-center">
                    <h1 class="font-bold">Kamar Kos</h1>
                    <UButton  to="/dashboard/kos/data-kamar-kos">Buka</UButton>
                </div>
            </UCard>
        </div>
    </main>

    <div class="flex justify-center items-center h-[50vh]">
        <UProgress class="md:max-w-[50vw]" />
    </div>

</template>

<script setup lang="ts">

navigateTo("/dashboard/kos/data-kos")

definePageMeta({
    layout: 'dashboard'
})

</script>