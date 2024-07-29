<template>
    <h1 class="text-2xl text-slate-600 font-bold">
        Daftar
    </h1>
    <UCard class="my-4">
        <ClientOnly>
            <template #fallback>
                <USkeleton class="w-[300px] h-[300px]" />
            </template>
            <UForm method="post" :state="state" class="space-y-4" @submit="onSubmit">

                <UFormGroup label="Nama Lengkap" name="name" class="w-[300px]">
                    <UInput v-model="state.name" placeholder="Ahmad Suhardi" autocomplete="off" />
                </UFormGroup>

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
                </UFormGroup>

                <UFormGroup label="Konfirmasi Password" name="password2">
                    <UInput v-model="state.password2" :type="hide_pass2 ? 'password' : 'text'" placeholder="password"
                        :ui="{ icon: { trailing: { pointer: '' } } }">
                        <template #trailing>
                            <UButton color="gray" variant="link"
                                :icon="hide_pass2 ? 'i-material-symbols-password-2-off' : 'i-material-symbols-password-2'"
                                :padded="false" @click="hide_pass2 = !hide_pass2" />
                        </template>
                    </UInput>
                </UFormGroup>

                <UFormGroup>
                    <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center">
                        Submit
                    </UButton>
                    <div class="flex justify-center mt-2">
                        <ULink to="/login" class="text-primary text-center text-sm hover:underline">
                            sudah punya akun? masuk
                        </ULink>
                    </div>
                </UFormGroup>
            </UForm>
        </ClientOnly>
    </UCard>
</template>

<script setup lang="ts">
const loading = ref(false)
const hide_pass = ref(true)
const hide_pass2 = ref(true)
const toast = useToast()

definePageMeta({
    layout: 'auth'
})

const state = reactive({
    name: undefined,
    number_phone: undefined,
    password: undefined,
    password2: undefined
})

async function onSubmit(event:any) {

    loading.value = true
    const { number_phone, password, password2, name } = event.data

    // check no empty
    if (!number_phone || !password || !password2 || !name) {
        loading.value = false
        return toast.add({ id: 'register', title: 'tolong isi semua form', color: 'red' })
    }

    // check number phone
    try {
        validatePhoneNumber(number_phone)
    } catch (error) {
        loading.value = false
        console.log(error)
        return toast.add({ id: 'register', title: 'whatsapp tidak valid', description: 'contoh: 085288509878', color: 'red' })
    }

    // check password
    try {
        validatePassword(password)
    } catch (error) {
        loading.value = false
        console.log(error)
        return toast.add({ id: 'register', title: 'password tidak valid', description: 'password minimal 8 huruf', color: 'red' })
    }

    // check password is same
    if (password != password2) {
        loading.value = false
        return toast.add({ id: 'register', title: 'password tidak sama', description: 'konfirmasi password dan password tidak sama', color: 'red' })
    }


    const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, number_phone, password }
    })

    if (res.status != 'sukses membuat akun') {
        loading.value = false
        return toast.add({ id: 'register', title: res.status, color: 'red' })
    }

    toast.add({ id: 'register', title: res.status})
    navigateTo('/login')

    loading.value = false
}
</script>