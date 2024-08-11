<template>
    <h1 class="text-2xl text-slate-600 font-bold">
        Reset Password
    </h1>
    <UCard class="my-4">
        <UForm v-if="can_change" :state="state" class="space-y-4" @submit="onSubmitReset">
            <UFormGroup label="Password Baru" name="password">
                    <UInput v-model="state.password" :type="hide_pass ? 'password' : 'text'" placeholder="password"
                        :ui="{ icon: { trailing: { pointer: '' } } }" class="w-[300px]">
                        <template #trailing>
                            <UButton color="gray" variant="link"
                                :icon="hide_pass ? 'i-material-symbols-password-2-off' : 'i-material-symbols-password-2'"
                                :padded="false" @click="hide_pass = !hide_pass" />
                        </template>
                    </UInput>
                </UFormGroup>

                <UFormGroup label="Konfirmasi Password Baru" name="password2">
                    <UInput v-model="state.password2" :type="hide_pass2 ? 'password' : 'text'" placeholder="password"
                        :ui="{ icon: { trailing: { pointer: '' } } }" class="w-[300px]">
                        <template #trailing>
                            <UButton color="gray" variant="link"
                                :icon="hide_pass2 ? 'i-material-symbols-password-2-off' : 'i-material-symbols-password-2'"
                                :padded="false" @click="hide_pass2 = !hide_pass2" />
                        </template>
                    </UInput>
                </UFormGroup>

            <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center">
                Submit
            </UButton>
        </UForm>

        <UForm v-else :state="state" class="space-y-4" @submit="onSubmitRequestReset">
            <UFormGroup label="Nomor Whatsapp" name="whatsapp" class="w-[300px]">
                <UInput data-cy='email' v-model="state.number_phone"  placeholder="085288509878" autocomplete="off" required/>
            </UFormGroup>

            <UButton data-cy='reset-button' :loading="loading" type="submit" class="w-full text-center items-center justify-center">
                Submit
            </UButton>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
const loading = ref(false)
const hide_pass = ref(true)
const hide_pass2 = ref(true)
const secret = useRoute().query.secret
const can_change = ref(false)

definePageMeta({
    layout: 'auth'
})

const state = reactive({
    number_phone: undefined,
    password: undefined,
    password2: undefined
})

if(secret){
    try {
        const res = await $fetch('/api/reset-password/check',{
            method:'post', body: {secret}
        })
    
        if(res.status == 'success'){
            can_change.value = true
        }
    } catch (error:any) {
        if(error.data)error = error.data;
        useToast().add({ id: 'reset password', title: 'error', description: error.message, color: 'red' })
    }
}


async function onSubmitRequestReset(event:any) {
    const {number_phone} = event.data
    loading.value = true

    try {
        const res = await $fetch('/api/reset-password/add', {
            method: 'post', body: {number_phone}
        })
        
        if(res.status == 'success'){
            // @ts-ignore
            useToast().add({ id: 'reset password', title: res.message })
        }
    } catch (error:any) {
        if(error.data)error = error.data;
        useToast().add({ id: 'reset password', title: 'error', description: error.message, color: 'red' })
    }
    loading.value = false
}

async function onSubmitReset(event:any) {
    const {number_phone, password, password2} = event.data
    loading.value = true

    try {

        // check password
        validatePassword(password)

        // check password is same
        if (password != password2) {
            throw new Error('konfirmasi password dan password tidak sama')
        }

        const res = await $fetch('/api/reset-password/update', {
            method: 'put', body: {secret, password}
        })
        
        if(res.status == 'success'){
            // @ts-ignore
            useToast().add({ id: 'reset password', title: res.message })
            navigateTo('/login')
        }
    } catch (error:any) {
        if(error.data)error = error.data;
        
        useToast().add({ id: 'reset password', title: 'error', description: error.message, color: 'red' })
    }
    loading.value = false
}
useHead({
    title: 'Reset Password'
})
</script>