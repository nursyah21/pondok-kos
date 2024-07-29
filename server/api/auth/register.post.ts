import argon2 from 'argon2'

export default defineEventHandler(async (event) => {
    const { name, number_phone, password } = await readBody(event)

    if (await Users.findOne({ number_phone: number_phone }) != null) {
        return { status: `${number_phone} sudah terdaftar` }
    }

    let user
    try {
        user = await Users.create({
            name, number_phone, password: await argon2.hash(password, {
                type: argon2.argon2d,
                memoryCost: 2 ** 10, // 1mb
                hashLength: 50,
            })
        })
    } catch (error:any) {
        console.error(error.message)
        return { status: 'fail', message: `${number_phone} sudah terdaftar` }
    }

    return { status: 'sukses membuat akun' }
})
