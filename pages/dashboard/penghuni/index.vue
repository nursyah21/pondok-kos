<template>

    <Breadcrumb />
    <main class="my-4">
        <div class="flex gap-x-4 gap-y-4 flex-col sm:flex-row">
            <UCard class='text-slate-600 w-[260px] h-[100px]'>
                <UIcon  name="i-material-symbols-supervisor-account-rounded" class="text-primary text-2xl" />
                <div class="flex justify-between items-center">
                    <h1 class="font-bold">Verifikasi Penghuni</h1>
                    <UButton  to="/dashboard/penghuni/data-verif">Buka</UButton>
                </div>
            </UCard>
            <UCard class='text-slate-600 w-[260px] h-[100px]'>
                <UIcon  name="i-material-symbols-supervisor-account-rounded" class="text-primary text-2xl" />
                <div class="flex justify-between items-center">
                    <h1 class="font-bold">Daftar Penghuni</h1>
                    <UButton  to="/dashboard/penghuni/data-penghuni">Buka</UButton>
                </div>
            </UCard>
        </div>
    </main>

    <div class="flex justify-center items-center h-[50vh]">
        <UProgress class="md:max-w-[50vw]" />
    </div>
</template>

<script setup>
navigateTo('/dashboard/penghuni/data-verif')


definePageMeta({
    layout: 'dashboard'
})

</script>