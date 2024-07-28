export default defineEventHandler(async (event) => {
    const { token, _id, name, description, location, image } = await readBody(event)

    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');
        
        if(!name || !description || !location){
            throw new Error('nama kos, deskripsi, lokasi wajib diisi')
        }
        
        const res = await Kos.findByIdAndUpdate(_id, {name, description, location, image})
        if(!res) throw new Error('data kos not exist');
        return {status: 'success', message: 'merubah data kos', id: res._id.toString()}
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})