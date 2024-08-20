export default defineEventHandler(async (event) => {
    const {  _id, name, description, location, image } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]
    
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
        let message = 'error saat memasukkan data'
        if(error.message.includes('E11000')){
            message = 'nama tidak boleh sama'
        }
        return { status: 'fail', message }
    }

})