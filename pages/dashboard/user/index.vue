<template>

    <Breadcrumb />
    <main class="my-4">
    <NavbarUser />
        
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