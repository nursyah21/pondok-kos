<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app';

const props = defineProps<{
    title: string,
    link: string,
    icon: string,
    color: string,
    total: string | number,
    type?: string,
    status?: AsyncDataRequestStatus
}>()

if(props.status == 'error'){
    useToast().add({id: 'dashboard',title: 'terjadi error saat fetch data', color: 'red' })
}
</script>

<template>
    <UCard v-if="status == 'success'" :class="'w-full  text-white '+props.color" :ui="{
        header: {
            padding: 'py-2 px-4'
        }
    }">
        <template #header>
            <div class="flex justify-between items-center">
                <ULink class="font-bold hover:underline" :to="props.link">
                    {{props.title}}
                </ULink>
                <UIcon :name="props.icon" />
            </div>
        </template>
        <div class="flex justify-between items-center">
            <h1 class="font-bold">
                <span v-if="typeof props.total == 'number'" class="text-2xl">
                    Rp{{shortWord(
                        formatRupiahIntl(props.total), 20
                    )}}
                </span>
                <span v-else class="text-3xl">
                    {{props.total}}
                </span>
                <span v-if="props.type" class="text-sm">&nbsp;{{props.type}}</span>
            </h1>
        </div>
    </UCard>
    <USkeleton v-else class="w-full md:w-[225px] md:max-w-[225px] h-[120px]" />
</template>