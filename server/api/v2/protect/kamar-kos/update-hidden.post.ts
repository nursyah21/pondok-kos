export default defineEventHandler(async (event) => {
    const { _id, id_kos, name, description, available:_available, image, price } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');

        const kosExists = await Kos.findById(id_kos);
        if(!kosExists){
            throw new Error('id kos tidak terdaftar')
        }
        
        const res = await KamarKos.findByIdAndUpdate(_id)
        if(!res) throw new Error('data kos not exist');
        if(kosExists.hidden) throw new Error('kos sekarang tidak aktif');

        await KamarKos.findByIdAndUpdate(_id, {hidden: !res.hidden})

        return {status: 'success', message: `status kamar kos ${res.hidden ? 'aktif' : 'nonaktif'}`}
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})