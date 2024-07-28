<template>

    <Breadcrumb />
    <main class="my-4">
        <ClientOnly>
            Pengeluaran
        </ClientOnly>
    </main>
</template>

<script setup>

definePageMeta({
    layout: 'dashboard'
})

const options = ref({
    chart: {
        type: 'donut',
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200,
                height: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
    labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
    dataLabels: {
        enabled: false
    }
})
const series = ref(
    [44, 55, 41, 17, 15]
)
</script>