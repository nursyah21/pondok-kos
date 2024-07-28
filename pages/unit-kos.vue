<template>
    <template v-if="totalPage">
        <RefreshButton :refresh="refresh" v-model:status="status" />
        <div class="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 justify-items-center" v-if="status == 'success'"> 
            <template v-for="i in rows">
            <UCard class="max-w-[320px]" :ui="{header:{padding:''}}">
                <template #header>
                    <img v-if="i.available == 0" :src="i.image[0] ?? '/images/noimage.png'" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px]" />
                    <img v-else :src="i.image[0] ?? '/images/noimage.png'" class="w-[300px] max-w-[300px] h-[260px] max-h-[260px] opacity-30" />
                </template>
                <div>
                    <h1 class="text-xl font-bold text-slate-600">{{shortWord(i.name, 10)}}</h1>
                    <h1 class="text-xs text-slate-800">{{shortWord(i.location, 20)}}</h1>
                    <UDivider />
                    <h1 class="my-4 text-sm text-slate-600">{{shortWord(i.description)}}</h1>
                    <div v-if="i.description.length < 20" class="h-[6px]"></div>
                    <div class="mt-4 flex justify-between">
                        <h1 class="text-primary-600 font-bold">{{ formatRupiahIntl(i.price) }}</h1>
                        <UButton v-if="i.available == 0" :to="'/login?kos='+i.id" >Pesan kamar</UButton>
                        <UButton v-if="i.available == 1" color="yellow" disabled>Sedang dipesan</UButton>
                        <UButton v-if="i.available == 2" color="red" disabled>Sudah ditempati</UButton>    
                    </div>
                </div>
            </UCard>
            </template> 
            <div class="md:col-span-2 lg:col-span-3 flex justify-center items-center">      
                <UPagination :disabled="status != 'success'" v-model="page" :page-count="pageCount" :total="totalPage" :to="(page) => ({
                    query: { page }
                })" :ui="{
                    wrapper: 'flex items-center gap-2',
                    rounded: '!rounded-full min-w-[32px] justify-center',
                    default: {
                        activeButton: {
                            variant: 'outline'
                        }
                    }
                }" />
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-[80vh]">
            <UProgress class="max-w-md"/>
        </div>

    </template>
    <div v-else>
        <div v-if="status == 'success'" class="flex justify-center items-center h-[80vh] text-slate-600">
            mohon maaf data kos belum tersedia
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'home'
})

const pageCount = 9
const page = ref(1)
const skip = ref(0)
const rows = ref<[Kos]>()
const totalPage = ref(0)

const query = computed(() => ({ skip: skip.value, limit: pageCount }))
const {data: raw, status, refresh} = await useFetch('/api/v2/public/all-kamar-kos',{
    query,
    method: 'get'
})

watch(() => useRoute().query,
    (e) => {
        // @ts-ignore
        skip.value = (e['page'] - 1) * pageCount
        refresh()
}, { deep: true, immediate: true })

watch(()=>status, (e)=>{
    if(e.value == 'success'){
        // @ts-ignore
        const {data, total} = raw.value
        rows.value = data
        totalPage.value = total
    }
}, { deep: true, immediate:true })
</script>