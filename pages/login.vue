<template>

    <h1 class="text-2xl text-slate-600 font-bold">
        Masuk
    </h1>
    <UCard class="my-4">
        <ClientOnly>
            <template #fallback>
                <USkeleton class="w-[300px] h-[200px]" />
            </template>
            <UForm :state="state" class="space-y-4" @submit="onSubmit">
                <UFormGroup label="Nomor Whatsapp" name="number_phone" class="w-[300px]">
                    <UInput v-model="state.number_phone" placeholder="085288509878" autocomplete="off" />
                </UFormGroup>

                <UFormGroup label="Password" name="password">
                    <UInput v-model="state.password" :type="hide_pass ? 'password' : 'text'" placeholder="password"
                        :ui="{ icon: { trailing: { pointer: '' } } }">
                        <template #trailing>
                            <UButton color="gray" variant="link"
                                :icon="hide_pass ? 'i-material-symbols-password-2-off' : 'i-material-symbols-password-2'"
                                :padded="false" @click="hide_pass = !hide_pass" />
                        </template>
                    </UInput>
                    <div class="mt-2 text-left">
                        <ULink to="/reset-password" class=" text-primary text-sm hover:underline">
                            lupa password?
                        </ULink>
                    </div>
                </UFormGroup>

                <UFormGroup>
                    <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center">
                        Submit
                    </UButton>
                    <div class="flex justify-center mt-2">
                        <ULink to="/register" class="text-primary text-center text-sm hover:underline">
                            belum punya akun? daftar
                        </ULink>
                    </div>
                </UFormGroup>
            </UForm>
        </ClientOnly>

    </UCard>
</template>

<script setup lang="ts">
import { setToken } from '~/utils/token';


const loading = ref(false)
const hide_pass = ref(true)
const toast = useToast()


definePageMeta({
    layout: 'auth'
})

const state = reactive({
    number_phone: undefined,
    password: undefined
})


async function onSubmit(event:any) {

    loading.value = true
    const { number_phone, password } = event.data

    // check no empty
    if (!number_phone || !password) {
        loading.value = false
        toast.add({ id: 'tolong isi semua form', title: 'tolong isi semua form', color: 'red' })
        return
    }

    // check number phone
    try {
        validatePhoneNumber(number_phone)
    } catch (error) {
        loading.value = false

        toast.add({ id: 'whatsapp tidak valid', title: 'whatsapp tidak valid', description: 'contoh: 085288509878', color: 'red' })
        return
    }

    // check password
    try {
        validatePassword(password)
    } catch (error) {
        loading.value = false
        toast.add({ id: 'password tidak valid', title: 'password tidak valid', description: 'password minimal 8 huruf', color: 'red' })
        return
    }

    try {

        const res = await $fetch('/api/v2/public/login', {
            method: 'POST',
            body: { number_phone, password }
        })

        // @ts-ignore
        if (res.status) throw new Error(res.message)

        await new Promise(res => setTimeout(res, 500))
        
        // use window location replace to reload token
        // @ts-ignore
        if (res.secret) {
            setToken(res.secret)
            const kos = useRoute().query.kos
            if (kos) {
                window.location.replace('/dashboard/find-kos?kos=' + kos)
            } else {
                window.location.replace('/dashboard')
            }
        }

    } catch (error:any) {
        if (error.data) error = error.data;
        toast.add({ id: 'login gagal', title: error.message, color: 'red' })
    }

    loading.value = false
}

</script>