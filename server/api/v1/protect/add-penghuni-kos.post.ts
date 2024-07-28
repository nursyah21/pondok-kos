export default defineEventHandler(async (event) => {
    const { token, id_user, id_kamar_kos, id_kos, tanggal_bayar } = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin');
        
        await PenghuniKos.create({id_user, id_kamar_kos, id_kos, tanggal_bayar})
        await KamarKos.findByIdAndUpdate(id_kamar_kos, {available: 2})

        return { status: 'success', message: 'sukses menambahkan penghuni' }


    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})