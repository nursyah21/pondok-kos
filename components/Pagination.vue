<template>
	<div class="flex justify-between  items-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
	            
	            <UButton v-if="rows && rows.length" variant='ghost' @click='refresh'  color='gray' :class="status == 'pending' && 'animate-pulse'" >
	                {{skip >= 1? skip + page - 1 : skip+page}} - {{ page * pageCount }} of {{ totalPage }}
	            </UButton>
	            <UButton v-else variant='ghost' @click='refresh'  color='gray' :class="status == 'pending' && 'animate-pulse'" >
	                tidak tersedia
	            </UButton>
	
				<!-- <UPagination :disabled="status == 'success'" v-model="page" :page-count="pageCount" :total="totalPage"  :ui="{ -->
	            <UPagination v-model="page" :page-count="pageCount" :total="totalPage"  :ui="{
	                wrapper: 'flex items-center gap-2',
	                rounded: '!rounded-full min-w-[32px] justify-center',
	                default: {
	                    activeButton: {
	                        variant: 'outline'
	                    }
	                }
	            }" />
	        </div>
</template>

<script setup lang="ts">
defineProps<{ 
	// refresh: any,
	totalPage: number,	
}>()
const refresh = ref<any>() //defineModel<any>('refresh',{required:true})
const rows = defineModel<[any] | any>('rows', { required: true })
const status = defineModel<any>('status')
const skip = defineModel<number>('skip', { required: true })
// const page = ref<number>()
const page = defineModel<number>('page', { required: true })
const pageCount = defineModel<number>('pageCount', { required: true })

watch(page, (e,_)=>{
	skip.value = (e - 1) * pageCount.value
	// @ts-ignore
    // refresh()
	console.log('=>',refresh)
})
</script>
