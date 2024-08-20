<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

const props = defineProps<{
    title: string
    color: string
    optionsChart: any
    series: any,
    description? :string,
    status?: AsyncDataRequestStatus | string
}>()

if (props.status == 'error') {
    useToast().add({ id: 'dashboard', title: 'terjadi error saat fetch data', color: 'red' })
}
</script>

<template>
    <UCard  v-if="status == 'success'" class="max-h-[300px]" :ui="{ header: { padding: 'py-2' }, body: {padding:'py-0'} }">
        <template #header>
            <h1 :class="'font-bold '+props.color">{{props.title}}</h1>
        </template>
        <apexchart :options="props.optionsChart" :series="props.series"></apexchart>
        <template #footer>
            <h1 v-if="description" class="text-xs text-slate-600">
                {{ props.description }}
            </h1>
        </template>
    </UCard>
    <USkeleton v-else class="w-full md:w-[385px] h-[240px]" /> 
</template>