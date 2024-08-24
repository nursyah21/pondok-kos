const updatePenghuniKosFromBooking = async () => {
    // const existNotUpdate = await Booking.findOne({paid_status: 2})
    const res = await Booking.aggregate
        ([
            {
                $lookup: {
                    from: 'kamar_kos',
                    localField: 'id_kamar_kos',
                    foreignField: '_id',
                    as: 'kamarKosDetails'
                }
            },
            {
                $lookup: {
                    from: 'kamar_kos',
                    localField: 'id_kamar_kos',
                    foreignField: '_id',
                    as: 'kamarKosDetails'
                }
            },
            {$unwind: "$kamarKosDetails"},
            {$addFields: {
                'kamarKosDetails._id': {$toString: "$kamarKosDetails._id"}
            }}
        ])

    // console.error(res)

    // res.forEach(async (e:any)=>{
    //     const date = new Date(e.createdAt);
    //     // Tambahkan durasi (dalam hari) ke tanggal awal
    //     date.setDate(date.getDate() + e.duration);
    //     // Format tanggal kembali ke string ISO 8601
    //     // const nextDateString = date.toISOString();

    //     // always update data if exist or not
    //     if(new Date().getTime() > date.getTime()){
    //         await PenghuniKos.findOneAndDelete({id_user:e.id_user, id_kamar_kos:e.id_kamar_kos})
    //     }else {
    //         // chck if penghuni already exist
    //         // if not add data to penghuni kos
    //         const exist = await PenghuniKos.findOne({id_user:e.id_user, id_kamar_kos:e.id_kamar_kos})
    //         if(exist){
    //             return
    //         }
    //         const idKos = await KamarKos.findById(e.id_kamar_kos).select(['id_kos'])
    //         // await PenghuniKos.create({id_user:e.id_user, id_kamar_kos:e.id_kamar_kos, id_kos:idKos?.id_kos, tanggal_bayar:e.updatedAt})
    //         // await PenghuniKos
    //     }
    // })
}


export default defineEventHandler(async (event) => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        await updatePenghuniKosFromBooking()

        const refreshTokens = await RefreshTokens.findOne({ token })

        if (!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')

        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin')
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const length = await PenjagaKos.find({}).countDocuments()


        let data = await PenghuniKos.find({})
            .select(['id_user', 'id_kamar_kos', 'id_kos', 'tanggal_bayar'])
            .skip(Number(skip))
            .limit(Number(limit))


        const data_user = data.map(e => (e.id_user))

        const penjaga = await Users.find({
            _id:
                { $in: data_user }
        }).select(['_id', 'name', 'number_phone', 'avatar'])

        const kos = await Kos.find({}).select(['_id', 'name'])
        const _kamarkos = await KamarKos.find({}).select(['_id', 'name', 'price', 'id_kos'])

        // @ts-ignore
        const kamarkos = _kamarkos.map(e => {
            const namekos = kos.find(f => f._id.toString() == e.id_kos)
            if (namekos) {
                return {
                    _id: e._id,
                    id_kamar_kos: e._id, id_kos: e.id_kos, price: e.price,
                    kamar: e.name, kos: namekos.name
                }
            }
        })

        // @ts-ignore
        data = data.map((e, idx) => {
            const p = penjaga.find((f: any) => f._id.toString() == e.id_user)
            const kos_kamar = kamarkos.find((f: any) => f._id.toString() == e.id_kamar_kos)

            if (p != undefined && kos_kamar != undefined) {
                return {
                    num: Number(skip) + idx + 1, name: p.name, avatar: p.avatar, kos: kos_kamar.kos,
                    number_phone: p.number_phone, kamar: kos_kamar.kamar, price: kos_kamar.price,
                    id_user: e.id_user, id_kamar_kos: e.id_kamar_kos, id_kos: e.id_kos,
                    tanggal_bayar: e.tanggal_bayar, id: e._id
                }
            }
        })
        return { status: 'success', total: length, data: data }


    } catch (error: any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})