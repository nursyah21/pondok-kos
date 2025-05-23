export default defineEventHandler(async (event) => {
    const { name, description, address, image } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');
    
        if(!name || !description || !address){
            throw new Error('nama kos, deskripsi, lokasi wajib diisi')
        }
        
        const nameExist = await Kos.findOne({name})            
        if(nameExist) {
            throw new Error('nama kos tidak boleh sama')
        }
        const res = await Kos.create({name, description, address, image})
        
        return {status: 'success', message: 'menambahkan data kos', id: res._id.toString()}
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})