export default defineEventHandler(async (event) => {
    const { token, name, description, location, image } = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');
    
        if(!name || !description || !location){
            throw new Error('nama kos, deskripsi, lokasi wajib diisi')
        }
        
        // const nameExist = await Kos.findOne({name})            
        // if(nameExist) {
        //     throw new Error('nama kos tidak boleh sama')
        // }
        const res = await Kos.create({name, description, location, image})
        
        return {status: 'success', message: 'menambahkan data kos', id: res._id.toString()}
    } catch (error) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})