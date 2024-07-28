export default defineEventHandler(async (event) => {
    const { token, id_kos, name, description, available:_available, image, price } = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens ||!refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');
        const kosExists = await Kos.findById(id_kos);
        if(!kosExists){
            throw new Error('id kos tidak terdaftar')
        }
        let available = _available
        if(_available == 'tersedia'){
            available = 0
        }
        if(_available == 'tidak tersedia'){
            available = 2
        }
        const res = await KamarKos.create({id_kos, name, description, available, image, price})
        
        return {status: 'success', message: 'menambahkan data kamar kos', id: res._id.toString()}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(new Date().toLocaleTimeString(), error.message)
        return { status: 'fail', message: error.message }
    }

})