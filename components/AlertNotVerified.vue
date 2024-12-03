<template>
	<UCard v-if="!props.verified && props.role == 0"
	class="bg-[#aa0000] text-white my-2">
		akun mu masih belum terverifikasi, 
		lengkapi data diri anda dibagian 
		edit profile dan tunggu admin memverifikasi akun anda
		<UIcon name="i-solar-danger-bold" />
		<div class="h-[20px]"></div>
		<UButton class="hover:opacity-80" variant="outline" color="white"
		to="/dashboard/edit-profile">
			Edit Profile
		</UButton>
	</UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
	verified:boolean,
	role:number
}>()
</script>
