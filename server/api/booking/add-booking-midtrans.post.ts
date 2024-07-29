export default defineEventHandler(async (event:any) => {
    const { id_kamar_kos, link_payment, order_id } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role, verified } = user


        if (role != 0) throw new Error('user harus sebagai penghuni');
        if (!verified) throw new Error('user not verified');

        const kamar = await KamarKos.findById(id_kamar_kos)    
        if (!kamar) throw new Error('id kamar kos not valid');
        const {available, price} = kamar
        if (available != 0) throw new Error('Kamar sudah ditempati');

        const admin = await Users.findOne({role:2})
        // @ts-ignore
        // let {_id: id_admin} = admin
        
        const id_admin = admin?._id.toString()
        
        const res = await Booking.create({order_id, id_kamar_kos, 
            id_user: refreshTokens.id_user, 
            id_admin, price, method_payment: 'midtrans', link_payment })

        await KamarKos.findByIdAndUpdate(id_kamar_kos, {available: 1})

        return {status: 'success', message: 'menambahkan data booking kamar kos', id: res._id.toString()}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(error.message)
        return { status: 'fail', message: error.message }
    }

})