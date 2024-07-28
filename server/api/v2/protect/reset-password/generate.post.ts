export default defineEventHandler(async (event)=>{
    const {number_phone} = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        
        // find number_phone if not return not found number_phone
        const exist = await Users.findOne({number_phone: number_phone})        
        if(!exist) throw new Error(`nomor whatsapp tidak ditemukan`);

        // check authorization
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens ||!refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role == 0) throw new Error('user not authorization');
        
        if (exist.role == 1 && role != 2) throw new Error('user not authorization');

        // disable reset password with this id
        await ResetPassword.updateMany({id_user: exist._id}, {
            reset: true
        })
        // generate_id_reset
        const secret = crypto.randomUUID().split('-').join('')
        await ResetPassword.create({secret_key: secret, id_user: exist._id})
        
        // const link = `https://dev-kos-ta-nursyah.vercel.app/reset-password?secret=${secret}`
        const link = `http://localhost:3000/reset-password?secret=${secret}`

        return {status: 'success', message: 'sukses membuat link reset', link}
    } catch (error:any) {
        event.node.res.statusCode = 400
        return {status: 'fail', message: error.message}
    }
})