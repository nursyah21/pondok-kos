export default defineEventHandler(async (event) => {
    const { token, user_id, verified } = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)

        // @ts-ignore
        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin')
        
        const res = await Users.findByIdAndUpdate(user_id, {verified})
        const message = !verified ? 'sukses membatalkan verifikasi' : 'sukses memverifikasi'
        return { status: 'success',  message}


    } catch (error:any) {
        return { status: 'fail', message: error.message }
    }

})