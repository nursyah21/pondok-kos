export default defineEventHandler(async (event) => {
    const { _id, link_payment, result } = await readBody(event)
    
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        
        // create verification if we only have link
        if(result && link_payment){
            await Booking.findOneAndUpdate({link_payment}, {midtrans: result})
        }

        return {status: 'success', message: 'update data booking'}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(error.message)
        return { status: 'fail', message: error.message }
    }

})