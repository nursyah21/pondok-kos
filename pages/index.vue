<template>

    <main class="my-4 justify-center">

        <div class="flex justify-center">
            <div class="flex-col md:flex-row flex justify-between gap-x-4">
                <div class="text-slate-600 items-center flex max-w-[600px]">
                    <h1 class="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-200 font-bold">
                        Sudah berdiri sejak tahun 2012, <span class="underline text-primary">Kos Pondok Jaya</span>
                        Menawarkan hunian yang nyaman dan berlokasi strategis dekat kampus Unikarta Tenggarong dengan
                        harga yang terjangkau
                        <br>
                        <UButton class="font-bold mt-4" to="/cari-kos">Booking Sekarang</UButton>
                    </h1>
                </div>
                <div>
                    <img src="/images/rumahkos1.jpg" class="w-[600px] hover:shadow-xl rounded-3xl" />
                </div>
            </div>
        </div>

        <section class="mt-12">
            <h1 class="text-4xl text-slate-600 font-bold text-center dark:text-slate-200">
                Fasilitas
            </h1>
            <div class="flex mt-4 gap-y-4 flex-col dark:text-slate-200 ">
                <div class="flex gap-x-4 justify-center flex-col lg:flex-row gap-y-4 items-center">
                    <UCard :class="myClass.card">
                        <UIcon name="i-eos-icons-cleanup" class="text-primary text-2xl" />
                        <h1 class="font-bold dark:text-slate-200">Kebersihan</h1>
                        <p class="text-lg dark:text-slate-200">Kebersihan kos yang selalu dijaga</p>
                    </UCard>
                    <UCard :class="myClass.card">
                        <UIcon name="i-material-symbols-motorcycle-rounded" class="text-primary text-2xl" />
                        <h1 class="font-bold dark:text-slate-200">Tempat Parkir</h1>
                        <p class="text-lg dark:text-slate-200">Area parkir yang cukup luas</p>
                    </UCard>
                    <UCard :class="myClass.card">
                        <UIcon name="i-material-symbols-bed-rounded" class="text-primary text-2xl" />
                        <h1 class="font-bold dark:text-slate-200">Kasur dan Lemari</h1>
                        <p class="text-lg dark:text-slate-200">Kasur dan lemari untuk setiap kamar kos</p>
                    </UCard>
                </div>
                <div class="flex gap-x-4 justify-center flex-col lg:flex-row gap-y-4 items-center w-full">
                    <UCard :class="myClass.card">
                        <UIcon name="i-mingcute-bath-fill" class="text-primary text-2xl" />
                        <h1 class="font-bold dark:text-slate-200">Kamar mandi</h1>
                        <p class="text-lg dark:text-slate-200">Kamar mandi dalam dan kamar mandi luar</p>
                    </UCard>
                    <UCard :class="myClass.card">
                        <UIcon name="i-material-symbols-electric-bolt" class="text-primary text-2xl" />
                        <h1 class="font-bold dark:text-slate-200">Listrik</h1>
                        <p class="text-lg dark:text-slate-200">Token listrik dan listrik yang sudah include dalam pembayaran kos</p>
                    </UCard>
                    <UCard :class="myClass.card">
                        <UIcon name="i-material-symbols-electric-bolt" class="text-primary text-2xl" />
                        <h1 class="font-bold dark:text-slate-200">24 Jam</h1>
                        <p class="text-lg dark:text-slate-200">Buka setiap saat</p>
                    </UCard>
                </div>
            </div>
        </section>

        <section class="mt-12">
            <h1 class="text-4xl text-slate-600 dark:text-slate-200 font-bold text-center">
                Lokasi
            </h1>
            <div class="flex justify-center mt-4 mb-12">
                <ULink to="https://maps.app.goo.gl/fASzPr8hmtUD4iWh6" >
                    <img src="/public/images/maps.png" class="rounded-lg hover:opacity-70" />
                </ULink>
                
            </div>
        </section>

    </main>
</template>
<script setup>
definePageMeta({
    layout: 'home'
})

const myClass = reactive({
    card: 'text-slate-600 w-full h-[200px] text-2xl hover:bg-primary-200'
})

</script>