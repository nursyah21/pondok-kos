import argon2 from 'argon2'

export default defineEventHandler(async (event) => {
    const { _id } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin')           
        
        const res = await PenjagaKos.findByIdAndDelete(_id)
        if (!res) throw new Error('data penjaga sudah terhapus')

        return { status: 'success', message: 'sukses hapus penjaga' }
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(error.message)
        return { status: 'fail', message: error.message }
    }

})