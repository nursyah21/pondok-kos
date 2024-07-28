export default defineEventHandler(async (event) => {
    const { id_user, id_kamar_kos, id_kos, tanggal_bayar } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin');


        
        // create new transaksi manual
        const order_id = "order_id_" + Math.round((new Date()).getTime() / 1000)
        console.log(id_kamar_kos, order_id)
        const price_kos = await KamarKos.findById(id_kamar_kos)

        // await Booking.create({order_id, id_kamar_kos, price: price_kos?.price,
        //     id_user, id_admin: refreshTokens.id_user, method_payment: 'manual', paid_status: 2 })
        
        // await PenghuniKos.create({id_user, id_kamar_kos, id_kos, tanggal_bayar})
        // await KamarKos.findByIdAndUpdate(id_kamar_kos, {available: 2})

        return { status: 'success', message: 'sukses menambahkan penghuni' }


    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})