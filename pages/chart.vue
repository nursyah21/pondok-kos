<template>
    <UContainer class="flex flex-col gap-y-2">
        <ClientOnly>
            <apexchart width="100%" height="400" type="bar" :options="options" :series="series"
                        class="bg-transparent max-w-[48em]"></apexchart>
        </ClientOnly>
    </UContainer>
</template>
<script setup>
const options = ref({
    chart: {
        id: 'vuechart-example',
        // theme: {
        //     mode: 'light'
        // }
    },
    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
})
const series = ref([{
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
}])
</script>