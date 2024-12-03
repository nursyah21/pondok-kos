// import { validatePhoneNumber } from "@server/validation"


export default defineEventHandler(async (event) => {
    const { name, birthdate, avatar, number_phone, id_card, address} = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        validatePhoneNumber(number_phone)
        
        try {
            await Users.findByIdAndUpdate(refreshTokens.id_user, {
                name, number_phone, avatar, id_card, birthdate, address
            })
        } catch (error) {
            throw new Error('nomor hp sudah terdaftar')
        }

        return { status: 'success', message: 'berhasil update profile' }
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }
})


