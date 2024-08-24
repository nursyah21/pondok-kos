export default defineEventHandler(async (event) => {
    const { id_user, id_kamar_kos, id_kos, tanggal_bayar, id } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin');
        
        // whats wrong with id kamar kos        
        await KamarKos.findByIdAndUpdate(id_kamar_kos, {available: 0})
        await PenghuniKos.findByIdAndDelete(id)

        return { status: 'success', message: 'sukses menghapus penghuni' }


    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})