export default defineEventHandler(async (event) => {
    const { token, _id, link_payment, attachment, price } = await readBody(event)
    
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        
        let booking;
        let query = {paid_status: 2, attachment, method_payment: 'manual'}
        query = price ? {...query, price} : query
        if(link_payment){
            booking = await Booking.findOneAndUpdate({link_payment: link_payment}, query)
        }else{
            booking = await Booking.findByIdAndUpdate(_id, query)
        }


        if(!booking) throw new Error('booking sudah tidak tersedia');
        await KamarKos.findByIdAndUpdate(booking.id_kamar_kos, {available: 2})

        return {status: 'success', message: 'memverifikasi booking kamar kos'}
    } catch (error) {
        event.node.res.statusCode = 400
        console.log(error.message)
        return { status: 'fail', message: error.message }
    }

})