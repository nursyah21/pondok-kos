export default defineEventHandler(async (event: any) => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]
    
    try {
        const refreshTokens = await RefreshTokens.findOne({ token })
        if (!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin');

        const user_id = getRequestURL(event).searchParams.get('user_id')
        
        const data= await Users.findById(user_id)

        // { name, number_phone, verified, avatar, id_card, birthdate, address } 
        return { status: 'success', data }


    } catch (error: any) {
        console.error('penghuni-user,post.ts',error)
        return { status: 'fail', message: error.message }
    }

})