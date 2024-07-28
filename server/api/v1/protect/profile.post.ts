interface Return {
    status: Status
    data?: Profile
    message?: string | any
}

export default defineEventHandler(async (event):Promise<Return> => {
    const { token } = await readBody(event)

    try {
        const data = await $fetch('/api/v1/public/verify',{
            method: 'post', body: {token}
        })

        if(data.status == 'fail') throw new Error(data.message);
        
        // @ts-ignore
        const { name, role, number_phone, verified, avatar, id_card, birthdate, address } = data.data
        return {status: 'success', data: { name, role, number_phone, verified, avatar, id_card, birthdate, address }}
    } catch (error: any) {
        return { status: 'fail', message: error.message }
    }

})