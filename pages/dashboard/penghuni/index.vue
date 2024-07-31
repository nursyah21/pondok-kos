<template>

    <Breadcrumb />
    <main class="my-4">
        <NavbarPenghuni />
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