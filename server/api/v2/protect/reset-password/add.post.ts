export default defineEventHandler(async (event)=>{
    const {number_phone} = await readBody(event)

    try {
        // find number_phone if not return not found number_phone
        const exist = await Users.findOne({number_phone: number_phone})        
        if(!exist) throw new Error(`nomor whatsapp tidak ditemukan`)

        
        // generate_id_reset if already generate and not 1 day return already send it or please wait 24hour before try again
        const check = await ResetPassword.find({id_user: exist._id
        , createdAt: {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }, reset: false})

        const link_ = `${event.node.req.headers.origin}/reset-password`

        if(check.length){
            // if(!check.length) throw new Error('ada error')
            if(check) return {status: 'success', message: `reset password sudah dikirim coba lagi setelah ${differentTime(check[0].createdAt)}`}
        }

        const secret = crypto.randomUUID().split('-').join('')
        await ResetPassword.create({secret_key: secret, id_user: exist._id})
        
        
        const link = `${event.node.req.headers.origin}/reset-password?secret=${secret}`
        // send link generate id_reset with wa
        await $fetch('/api/v2/protect/fontee',{
            method: 'post', body: {
                target: number_phone, message: `Kami menerima permintaan untuk mereset kata sandi akun Kos Pondok Jaya Anda. Untuk mereset kata sandi Anda, silakan klik tautan berikut:

${link}

Tautan ini akan kedaluwarsa dalam 24 jam. Jika Anda tidak meminta pengaturan ulang kata sandi, Anda dapat mengabaikan pesan ini.

Terima kasih,
Tim Kos Pondok Jaya
                `
            }
        })

        return {status: 'success', message: 'sukses mengirimkan reset password'}

        
    } catch (error:any) {
        event.node.res.statusCode = 400
        return {status: 'fail', message: error.message}
    }
})