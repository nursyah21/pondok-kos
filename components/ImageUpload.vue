<template>
	<div class="flex justify-center">
		<UButton variant='link' @click='imageModal = true'>
			<UAvatar v-if="profile" size="3xl" :src="image ? image : '/images/profile.png'" alt="Avatar" />
			<img v-else :src="image ? image : '/images/noimage.png'" alt="image kos" class="w-[200px] h-[200px] rounded-lg">
		</UButton>
		<UModal v-model='imageModal'>
			<UCard :ui="{ header: { padding: 'py-2', base: 'flex justify-between items-center' } }">
				<template #header>
					<h1 class="font-bold text-slate-600 dark:text-slate-200">
						Preview Image
					</h1>
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
						@click="imageModal = false" />
				</template>
				<div class="flex justify-center pb-2 mb-4 border-b-2">					
					<div :class="loading && 'animate-pulse'">
						<img v-if="profile" size="3xl" :src="image ? image : '/images/profile.png'" alt="Avatar" 
							class="'w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full"/>
						<img v-else :src="image ? image : '/images/noimage.png'" alt="image kos"
							class="'w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-lg">
					</div>
				</div>
				<div v-if="!disabled"  class="flex gap-x-2 items-center justify-between">
					<UFormGroup label="Foto kos" name="poto_kos">
						<template #label>
							<div class="flex items-center gap-x-2 hover:opacity-50 cursor-pointer">
								<UIcon name="i-material-symbols-add-circle" class="text-2xl" /> Upload
							</div>
						</template>
						<UInput type="file" icon="i-heroicons-folder" accept="image/*" @change="changeImage" class="hidden"/>
					</UFormGroup>
					<UFormGroup label="hapus" >
						<template #label>
							<div @click="image = ''" class="flex items-center gap-x-2 hover:opacity-50 cursor-pointer">
								<UIcon name="i-material-symbols-delete" class="text-2xl" /> Hapus
							</div>
						</template>
					</UFormGroup>
				</div>
			</UCard>
		</UModal>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	changeImage: any,
	disabled?: boolean,
	profile?: boolean
}>()
const imageModal = ref(false)
// const disabled = defineModel<boolean>({default: false})
const image = defineModel<any>('image', { required: true })
const loading = defineModel<boolean>('loading', { required: true })

</script>
