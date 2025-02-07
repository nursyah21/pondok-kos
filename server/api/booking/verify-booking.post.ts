export default defineEventHandler(async (event) => {
    const data = await readBody(event)
    // { _id, link_payment, attachment, price, method } = await readBody(event)
    
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid');

        console.log(data);
        // const i =
        const order_id = data?.order_id
        await Booking.findOneAndUpdate({order_id}, {paid_status: 2, method_payment: "manual"})
        
        await Booking.findOneAndUpdate({order_id}, {paid_status: 2, method_payment: "manual"})
        // console.log(i)
        // await Booing.create({
        //     order_id: data?.order_id
        //     // "order_id_" + Math.round(new Date().getTime() / 1000),
        //     id_kamar_kos: kamar?._id,
        //     id_user: penghuni?._id,
        //     id_admin: pemilik?._id,
        //     price: 100000,
        //     method_payment: "manual",
        //     duration: 30,
        //     paid_status: 2,
        //   });

        // create verification if we only have link
        // if (link_payment && method == 'midtrans'){
        //     const booking = await Booking.findOne({link_payment})
        //     if (booking?.midtrans){
        //         checkBooking()
        //     }
        // }

        // let booking;
        // let query = {paid_status: 2, attachment, method_payment: 'manual'}
        // // @ts-ignore
        // query = price ? {...query, price} : query
        // if(link_payment){
        //     booking = await Booking.findOneAndUpdate({link_payment: link_payment}, query)
        // }else{
        //     booking = await Booking.findByIdAndUpdate(_id, query)
        // }

        // if(!booking) throw new Error('booking sudah tidak tersedia');
        // await KamarKos.findByIdAndUpdate(booking.id_kamar_kos, {available: 2})

        return {status: 'success', message: 'verifikasi booking kamar kos'+ data}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(error.message)
        return { status: 'fail', message: error.message }
    }

})