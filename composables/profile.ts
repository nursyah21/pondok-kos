export const myProfile = async () => {
    
    const data = await $fetch('/api/auth/profile', {
        headers: {
            Authorization: `Bearer ${token}`
       },
        method: 'post'
    })
    
    return data
}
// @ts-ignore
export const profile:Ref<Profile|undefined> = ref()
