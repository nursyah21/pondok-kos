
export default defineEventHandler(async (event) => {
    const { message, target } = await readBody(event)

    let res;    
    try {
        res = await $fetch('https://api.fonnte.com/send', {
            method: 'post',
            headers: {
                'Authorization': useRuntimeConfig().fontee,
            },
            body: {
                target, message, countryCode: '62'
            }
        })
    } catch (error:any) {
        console.error('error: ' + error)
        return { status: 'fail send message' }
    }
    return { status: 'success', message: res }
});
