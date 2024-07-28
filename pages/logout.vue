<template>

    <h1 class="text-2xl text-slate-600 font-bold">
        Logout
    </h1>
    <div class="my-4">
        <UProgress animation="carousel" class="w-[300px]" />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})


async function logout() {
    
    await $fetch('/api/v2/public/logout', {
        headers: {
            Authorization: `Bearer ${token}`
        },method: 'POST'
    })
    clearToken()
    await new Promise(res => setTimeout(res, 500))
    
    navigateTo('/login')

}

logout()
</script>