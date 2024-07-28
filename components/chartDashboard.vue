<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

const props = defineProps<{
    title: string
    color: string
    optionsChart: any
    series: any,
    type: string,
    description? :string,
    status?: AsyncDataRequestStatus | string
}>()

if (props.status == 'error') {
    useToast().add({ id: 'dashboard', title: 'terjadi error saat fetch data', color: 'red' })
}
</script>

<template>
    <UCard v-if="status == 'success'" :class="'w-full'" :ui="{ header: { padding: 'p-2' } }">
        <template #header>
            <h1 :class="'font-bold '+props.color">{{props.title}}</h1>
        </template>
        <apexchart class="w-100vw" :type="props.type" :options="props.optionsChart" :series="props.series"></apexchart>
        <h1 v-if="description" class="text-xs text-slate-600">
            {{ props.description }}
        </h1>
    </UCard>
    <USkeleton v-else class="w-full md:w-[385px] h-[240px]" />
</template>