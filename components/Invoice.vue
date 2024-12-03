<template>
    <div class="hidden print:block fixed inset-0 z-50 items-center justify-center container mx-auto my-12">
        <InvoicePage :data="data" :moment="moment" :getNextDate="getNextDate" :formatRupiahIntl="formatRupiahIntl" />
    </div>

    <div class="print:hidden">
        <div class="p-4">
            <InvoicePage :data="data" :moment="moment" :getNextDate="getNextDate" :formatRupiahIntl="formatRupiahIntl" />
        </div>

        <div class="my-2 mb-4 flex justify-center print:hidden">
            <UButton @click="cetak" size="md">print invoice</UButton>
        </div>
    </div>
</template>


<script setup lang="ts">
import moment from 'moment';
import InvoicePage from './InvoicePage.vue'

defineProps<{
    data:any
}>()

const cetak = () => {
    window.print()
}
</script>