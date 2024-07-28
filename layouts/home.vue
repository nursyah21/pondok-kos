<template>
    <UContainer class="my-2">
        <nav class="flex justify-between border-b-2 border-gray-200 shadow-md p-3 rounded-xl ">
            <div>
                <ULink to="/" class="text-primary font-bold text-2xl flex items-center gap-x-2">
                    <UIcon name="i-material-symbols-other-houses" />
                    Pondok Jaya
                </ULink>
            </div>
            <UButton class="flex sm:hidden" @click="slide_over = true" fadded="false" variant="link"
                icon="i-charm-menu-hamburger" />
            <USlideover side="left" v-model="slide_over" class="sm:hidden">
                <div class="p-4 flex-1">
                    <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                        class="flex absolute end-5 top-5 z-10" square padded @click="slide_over = false" />

                    <div class="flex flex-col gap-y-2 mt-8">
                        <UButton @click="slide_over = false" to="/unit-kos" variant="link">
                            Lihat Unit Kos
                        </UButton>
                        <UButton to="/login" variant="outline" >Masuk</UButton>
                        <UButton to="/register" >Daftar</UButton>
                    </div>
                </div>
            </USlideover>
            <div class="hidden sm:flex gap-x-2">
                <div class="border-r-2 border-primary-300 " >
                    <UButton to="/unit-kos" variant="link">
                        Lihat Unit Kos
                    </UButton>
                </div>
                <UButton to="/login" variant="outline" >Masuk</UButton>
                <UButton to="/register" >Daftar</UButton>
            </div>
        </nav>
        <slot />
        <footer class="flex p-3 text-slate-600 justify-center flex-col border-t">
            <p class="text-slate-500 text-xs sm:text-sm text-center">
                Alamat:
                Jl. Gn. Galunggung 2 No.4, RT.47, Loa Ipuh, Kec. Tenggarong, Kabupaten Kutai Kartanegara, Kalimantan
                Timur 75513 <br>
                <ULink class="text-primary hover:underline" to="https://wa.me/6285250579806">
                    <UIcon name="i-bi-whatsapp" /> 085250579806
                </ULink>
            </p>
            <h1 class="text-center text-slate-500 mt-2 text-xs sm:text-sm">
                Copyright - 2024
            </h1>
        </footer>
    </UContainer>
</template>

<script setup lang="ts">
var slide_over = ref(false)

</script>