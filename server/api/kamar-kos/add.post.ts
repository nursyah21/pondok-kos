export default defineEventHandler(async (event) => {
    const { _id_kos, name, description, available, image, _price: price, _price_harian:price_harian } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens ||!refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');

        console.log(_id_kos)

        // const res = await KamarKos.create({id_kos:_id_kos, name, description, available, image, price})
        const res = await KamarKos.create({id_kos:_id_kos, name, description, image, price, price_harian})
        
        return {status: 'success', message: 'menambahkan data kamar kos', id: res._id.toString()}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(new Date().toLocaleTimeString(), error.message)
        return { status: 'fail', message: error.message }
    }

})