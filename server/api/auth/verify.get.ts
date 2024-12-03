interface Return {
    status: Status
    data: Profile | null | undefined
    message: string
}

export default defineEventHandler(async (event):Promise<Return> => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        
        return {status: 'success', data: user, message: 'verified'}


    } catch (error:any) {
        console.error(new Date().toLocaleTimeString(),'error:', error.message)
        return { status: 'fail', data: null, message: error.message }
    }
})