<template>

    <Breadcrumb />
    
    <main class="my-4 flex justify-center gap-x-4 flex-col gap-y-4">
        <div class="flex justify-center">
            <UCard class="max-w-sm w-[24rem]">                
                <div class="flex justify-center flex-col items-center gap-y-2">
                    <ImageUpload :changeImage="changeProfile" v-model:image="avatar" v-model:loading="loading" :profile="true" />

                    <template v-if="role == 0">
                        <UBadge v-if="verified">terverifikasi</UBadge>
                        <UBadge v-else color="yellow">belum terverifikasi</UBadge>
                    </template>
                    <UBadge v-if="role == 1" color="blue">penjaga</UBadge>
                    <UBadge v-if="role == 2" color="blue">pemilik</UBadge>
                </div>
                
                <UForm :state="state" @submit="onSubmit" class="space-y-4" enctype="multipart/form-data">
                    <UFormGroup label="Nama lengkap" name="name" class="w-full">
                        <UInput v-model="state.name" placeholder="nama lengkap" autocomplete="off" />
                    </UFormGroup>
                    <UFormGroup label="Nomor whatsapp" name="number_phone" class="w-full">
                        <UInput v-model="state.number_phone" placeholder="nomor whatsapp" autocomplete="off" />
                    </UFormGroup>
                    <UFormGroup label="Tanggal lahir" name="birth_date" class="w-full">
                        <UInput v-model="state.birthdate" type="date" />
                    </UFormGroup>
                    <UFormGroup label="Alamat asal" name="address" class="w-full">
                        <UInput v-model="state.address" placeholder="Alamat asal" autocomplete="off" />
                    </UFormGroup>                                        
                    <UFormGroup label="Kartu identitas" name="id_card" class="w-full">
                        <ImageUpload :changeImage="changeId" v-model:image="id_card" v-model:loading="loading" />                        
                    </UFormGroup>

                    <UFormGroup>
                        <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center">
                            Update
                        </UButton>
                    </UFormGroup>
                </UForm>
            </UCard>
        </div>
        
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard'
})

const data = profile
const _data = await myProfile()

let birthdate = ''
const verified = ref()
const role = ref()
const avatar = ref()
const id_card = ref()
const state = reactive({
    name: '',
    number_phone: '',
    birthdate: '',
    address: '',
})
if (_data.data) {
    if(_data.data.birthdate){
        birthdate = _data.data.birthdate.split('T')[0]
    }
    verified.value = _data.data.verified
    role.value = _data.data.role
    state.name = _data.data.name
    state.number_phone = _data.data.number_phone
    state.birthdate = birthdate
    state.address = _data.data.address
    avatar.value = _data.data.avatar
    id_card.value = _data.data.id_card
}


const loading = ref(false)

const changeProfile = (e:any) => uploadFile(e, loading, avatar)
const changeId = (e:any) => uploadFile(e, loading, id_card)


async function onSubmit(event:any) {
    loading.value = true
    const { data } = event
    try {
        const res = await $fetch('/api/auth/update-profile', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'PUT',
            body: {...data, avatar: avatar.value, id_card: id_card.value}
        })

        if (res.status == 'success') {
            useToast().add({ id: 'settings', title: 'success update profile' })
            
            if(_data.data){
                profile.value = {...data, avatar: avatar.value, id_card: id_card.value}
            }
        }   
    } catch (error:any) {
        if(error.data){
            error = error.data
        }
        useToast().add({ id: 'settings', title: 'error', description: error.message, color: 'red' })
    }

    loading.value = false

}

useHead({
    title: 'Edit Profile'
})
</script>