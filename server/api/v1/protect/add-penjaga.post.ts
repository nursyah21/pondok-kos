

export default defineEventHandler(async (event) => {
    const { token, id_penjaga: id_user, id_kos } = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');
        
        const exist = await PenjagaKos.findOne({id_kos, id_user})
        if(exist){
            console.error('\n',exist, id_user, id_kos)
            throw new Error('penjaga kos sudah terdaftar pada kos ini')
        }
        await PenjagaKos.create({id_kos, id_user})

        return { status: 'success', message: 'sukses menambahkan penjaga' }


    } catch (error:any) {
        event.node.res.statusCode = 400
        let message = `gagal menambahkan penjaga`
        if(error.message){
            message = error.message
        }
        return { status: 'fail', message  }
    }

})