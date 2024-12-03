export default defineEventHandler(async (event) => {
    const { _id, link_payment } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        
        let booking;
        const query = {paid_status: 0, method_payment: 'manual'}
        if(link_payment){
            booking = await Booking.findOneAndUpdate({link_payment: link_payment}, query)
        }else{
            booking = await Booking.findByIdAndUpdate(_id, query)
        }

        if(!booking) throw new Error('booking sudah tidak tersedia');
        await KamarKos.findByIdAndUpdate(booking.id_kamar_kos, {available: 0})


        return {status: 'success', message: 'membatalkan booking kamar kos'}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(error.message)
        return { status: 'fail', message: error.message }
    }

})