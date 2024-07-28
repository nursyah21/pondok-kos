interface Return {
    status: Status
    data?: Profile
    message?: string | any
}

export default defineEventHandler(async (event):Promise<Return> => {    
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const data = await $fetch('/api/v2/public/verify',{
            headers: {
                Authorization: `Bearer ${token}`
           },
            method: 'post'
        })

        if(data.status == 'fail') throw new Error(data.message);
        
        // @ts-ignore
        const { name, role, number_phone, verified, avatar, id_card, birthdate, address } = data.data
        return {status: 'success', data: { name, role, number_phone, verified, avatar, id_card, birthdate, address }}
    } catch (error: any) {
        return { status: 'fail', message: error.message }
    }

})