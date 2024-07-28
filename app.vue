<template>
  <NuxtLoadingIndicator />
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
      <UNotifications />
    </NuxtLayout>
    <template #fallback>
      <div class="flex h-screen justify-center items-center flex-col gap-y-4">
        <div> 
          <h1 class="font-bold gap-x-2 text-primary text-2xl flex flex-row items-center">
            <UIcon name="i-material-symbols-other-houses" />
            Pondok Jaya
          </h1>
        </div>
        <UProgress animation="carousel" class="max-w-[80%]" />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
if(process.env.NODE_ENV === "production"){
  console.log = function(){}
  console.info = function(){}
  console.debug = function(){}
}

useSeoMeta({
  titleTemplate: (title) => {
    return title ? `${title} | Pondok Kos Jaya` : 'Pondok Kos Jaya'
  },
})

</script>