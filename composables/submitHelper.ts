type method = 'get' | 'post' | 'put' | 'delete'

const abstrackSubmit = async (
    method:method, loading:Ref<Boolean>, isOpen:Ref<Boolean>,
    idToast: string, link:string, refresh:any,
    ...data:any) => {

    loading.value = true
    let res:any = ''
    try {
        res = await $fetch(link, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: method,
            body: { ...data[0] }
        })

        if (res.status == 'success') {
            useToast().add({  title: res.message })
            refresh()
        }
    } catch (error:any) {
        if (error.data) {
            error = error.data
        }        
        // if (error.message.toLowerCase().includes('validation')){
        //     error.message = error.message.split(':')[2]        
        // }
        useToast().add({ title: error.message, color: 'red' })
        loading.value = false
        return;
    }
    isOpen.value = false
    loading.value = false
    return res
}


export const submitHelperPost = async (
    loading:Ref<Boolean>, isOpen:Ref<Boolean>,
    idToast: string, link:string, refresh:any,
    ...data:any) => abstrackSubmit(
    'post', loading, isOpen, idToast, link, refresh, ...data
)

export const submitHelperPut = async (
    loading:Ref<Boolean>, isOpen:Ref<Boolean>,
    idToast: string, link:string, refresh:any,
    ...data:any) => abstrackSubmit(
    'put', loading, isOpen, idToast, link, refresh, ...data
)

export const submitHelperDelete = async (
    loading:Ref<Boolean>, isOpen:Ref<Boolean>,
    idToast: string, link:string, refresh:any,
    ...data:any) => abstrackSubmit(
    'delete', loading, isOpen, idToast, link, refresh, ...data
)