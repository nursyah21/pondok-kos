
export default defineEventHandler(async (event) => {
    const {token, id, role: _role} = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid');
        
        // mengubah role dari penjaga ke penghuni dan sebaliknya
        let role = _role == 1 ? 0 : 1;

        const res = await Users.findByIdAndUpdate(id, {role: role})

        return { status: 'success', message: 'berhasil mengubah role' }
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }
})


