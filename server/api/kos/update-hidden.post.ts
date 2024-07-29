export default defineEventHandler(async (event) => {
    const {  _id } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]
    
    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin');
        
        // if(!name || !description || !location){
        //     throw new Error('nama kos, deskripsi, lokasi wajib diisi')
        // }
        
        const res = await Kos.findById(_id)
        if(!res) throw new Error('data kos not exist');
        await Kos.findByIdAndUpdate(_id, {hidden: !res.hidden})
        if(!res.hidden){            
            await KamarKos.updateMany({id_kos: res._id}, {hidden: true})
        }else{
            await KamarKos.updateMany({id_kos: res._id}, {hidden: false})
        }

        return {status: 'success', message: `status kos ${res.hidden ? 'aktif' : 'nonaktif'}`}
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})