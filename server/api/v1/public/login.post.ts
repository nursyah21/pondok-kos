import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const { number_phone, password } = await readBody(event)

    try {
        let user = await Users.findOne({ number_phone: number_phone })
        
        if (user == null) {
            throw new Error(`${number_phone} tidak terdaftar`)
        }

    
        if (!await argon2.verify(user.password, password)) {
            throw new Error('nomor whatsapp atau password tidak valid')
        }

        let secret = jwt.sign(
            { id: user._id.toString() },
            useRuntimeConfig().secret,
            { algorithm: 'HS256', expiresIn: '14d' }
        )

        await RefreshTokens.create({token: secret, last_used: Date(), id_user: user._id.toString()})
    
        return { status: '', message: 'login berhasil', secret: secret }
    }catch(e:any){
        console.error(new Date().toLocaleTimeString(), 'error:', e.message)
        event.node.res.statusCode = 400
        return { status: 'fail', message: e.message, secret: '' }
    }
})
