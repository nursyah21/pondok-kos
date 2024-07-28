<template>

    <Breadcrumb />
    <main class="my-4">
        <ClientOnly>
            <template #fallback>
                <USkeleton class="w-[300px] h-[200px]" />
            </template>
            Messages: {{ realtime }}
            <UForm :state="state" class="mt-4 space-y-4" @submit="onSubmit">

                <UInput v-model="state.messages" placeholder="tulis pesan..." autocomplete="off" />
                <UButton :loading="loading" type="submit" class="w-full text-center items-center justify-center">
                    Kirim
                </UButton>
            </UForm>
        </ClientOnly>
    </main>
</template>

<script setup>
import { getDatabase, set, ref as refFire, onValue } from 'firebase/database';
const dbRealtime = getDatabase()
const loading = ref(false)
const realtime = ref('null')
definePageMeta({
    layout: 'dashboard'
})

const state = reactive({
    messages: undefined,
})

async function getData() {

    try {

        const snapshot = refFire(dbRealtime, 'messages/' + 'nursyah') //await reference.get();
        // console.log(snapshot, (e)=>{
            
        // })
        // data.value = snapshot.val();
        onValue(snapshot, (e)=>{
            const data = e.val()
            if(data.messages){
                realtime.value = data.messages
            }
            // console.log(data)
        })
    } catch (error) {
        console.error('Error retrieving initial data:', error);
    }

    // Set up a listener for value changes
    //   reference.on('value', (snapshot) => {
    //     data.value = snapshot.val();
    //   });
}

getData()

async function onSubmit(event) {
    loading.value = true
    const { messages } = event.data

    set(refFire(dbRealtime, 'messages/' + 'nursyah'), {
        sender: 'nursyah',
        messages: messages
    });
    await new Promise(res => setTimeout(res, 500))
    loading.value = false

}

</script>