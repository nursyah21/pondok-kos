<template>
    <!-- <Protect /> -->
    <UContainer class="my-2">
        <nav class="flex justify-between border-b-2 border-gray-200 dark:border-gray-800 shadow-md p-3 rounded-xl ">
            <div>
                <ULink to="/" class="text-primary font-bold text-2xl flex items-center gap-x-2">
                    <UIcon name="i-material-symbols-other-houses" />
                    Pondok Jaya
                </ULink>
            </div>
        </nav>
        <div class="flex h-[80vh] justify-center items-center flex-col">
            <slot />
        </div>
        <footer class="flex p-3 text-slate-600 justify-center flex-col border-t dark:border-gray-600">
            <p class="text-slate-500 text-xs sm:text-sm text-center dark:text-slate-200">
                Alamat:
                Jl. Gn. Galunggung 2 No.4, RT.47, Loa Ipuh, Kec. Tenggarong, Kabupaten Kutai Kartanegara, Kalimantan
                Timur 75513 <br>
                <ULink class="  text-primary hover:underline" to="https://wa.me/6285250579806">
                    <UIcon name="i-bi-whatsapp" /> 085250579806
                </ULink>
            </p>
            <h1 class=" dark:text-slate-400 text-center text-slate-500 mt-2 text-xs sm:text-sm">
                Copyright - 2024
            </h1>
        </footer>
    </UContainer>
</template>

<script setup lang="ts">

</script>