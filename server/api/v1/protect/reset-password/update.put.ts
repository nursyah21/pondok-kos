import checkTime from '~/utils/checkTime'
import argon2 from 'argon2'

export default defineEventHandler(async (event) => {
    const { secret, password } = await readBody(event)

    try {
        if (!secret || !password) throw new Error('field tidak lengkap');

        // check id_reset if already 24 hour or  return not valid
        const exist = await ResetPassword.findOne({ secret_key: secret })
        if (!exist) throw new Error(`secret tidak valid`);

        const timeLimit = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        const createdAt = new Date(exist.createdAt)
        if (createdAt < timeLimit) { // already 24 hour
            throw new Error(`secret tidak valid`)
        }
        if (exist.reset) throw new Error(`secret tidak valid`);

        // find number_phone if not return not found number_phone
        await Users.findByIdAndUpdate(exist.id_user, {
            password: await argon2.hash(password, {
                type: argon2.argon2d,
                memoryCost: 2 ** 10, // 1mb
                hashLength: 50,
            })
        })

        await ResetPassword.findByIdAndUpdate(exist._id, { reset: true })

        return { status: 'success', message: 'password berhasil diupdate' }
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }
})