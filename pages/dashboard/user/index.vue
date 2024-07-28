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
                    <h1 class="font-bold">Penjaga</h1>
                    <UButton  to="/dashboard/user/data-penjaga">Buka</UButton>
                </div>
            </UCard>
        </div>
        
    </main>
    <div class="flex justify-center items-center h-[50vh]">
        <UProgress class="md:max-w-[50vw]" />
    </div>
</template>

<script setup lang="ts">
navigateTo('/dashboard/user/data-user')

definePageMeta({
    layout: 'dashboard'
})

</script>