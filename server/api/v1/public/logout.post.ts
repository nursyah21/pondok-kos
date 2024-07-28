export default defineEventHandler(async (event) => {
    const {token} = await readBody(event)
    
    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid');


        await RefreshTokens.deleteOne({token})

        return { status: '', message: 'success logout' }

    } catch (error:any) {
        console.error(new Date().toLocaleTimeString(),'error', error.message)
    }


    // this is unnecessary api, but just keep it ok
    return { status: '', message: 'not logout' }
})
