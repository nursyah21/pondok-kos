type UploadType = 'replace' | 'add'


/**
 * upload file to api
 * 
 * @ type replace will replace prev file (default)
 * @ type add will add new file didnt replace prev file
 */
export const uploadFile = async(event:any, loading:any, state:any, type:UploadType = 'replace') => {
    if (event[0]) {
        loading.value = true

        const data = new FormData()
        // data.append('token', token)
        data.append('files', event[0])
        // add link to remove previous data
        if(type == 'replace' && state.value){
            data.append('link', state.value)
        }
        
        let message = ''

        try {
            const res = await $fetch('/api/v2/protect/files', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                method: 'post',
                body: data
            })
            
            // @ts-ignore
            if (res.message) {
                useToast().add({ id: 'upload file', title: 'success upload file' })
                // @ts-ignore
                state.value = res.message
                // @ts-ignore
                message = res.message
            }   
        } catch (error:any) {
            console.error('uploadFile.ts', error.message)
            useToast().add({ id: 'upload file', title: 'uploadfile error' , color: 'red'})
        }
        
        loading.value = false

        return message
    }
}