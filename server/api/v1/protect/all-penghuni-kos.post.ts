const updatePenghuniKosFromBooking = async () => {
    // const existNotUpdate = await Booking.findOne({paid_status: 2})
    const res = await Booking.find({}).select(['id_kamar_kos','id_user','createdAt','updatedAt','paidStatus','duration'])

    res.forEach(async (e:any)=>{
        const date = new Date(e.createdAt);
        // Tambahkan durasi (dalam hari) ke tanggal awal
        date.setDate(date.getDate() + e.duration);
        // Format tanggal kembali ke string ISO 8601
        // const nextDateString = date.toISOString();

        // always update data if exist or not
        if(new Date().getTime() > date.getTime()){
            
            await PenghuniKos.findOneAndDelete({id_user:e.id_user, id_kamar_kos:e.id_kamar_kos})
        }else {
            // chck if penghuni already exist
            // if not add data to penghuni kos
            const exist = await PenghuniKos.findOne({id_user:e.id_user, id_kamar_kos:e.id_kamar_kos})
            if(exist){
                return
            }
            const idKos = await KamarKos.findById(e.id_kamar_kos).select(['id_kos'])
            await PenghuniKos.create({id_user:e.id_user, id_kamar_kos:e.id_kamar_kos, id_kos:idKos?.id_kos, tanggal_bayar:e.updatedAt})
            // await PenghuniKos
        }
    })
}


export default defineEventHandler(async (event) => {
    const { token } = await readBody(event)
    

    try {
        await updatePenghuniKosFromBooking()

        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role == 0) throw new Error('user not authorization, you must be admin')
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const length = await PenjagaKos.find({}).countDocuments()
        
        
        let data = await PenghuniKos.find({})
            .select(['id_user','id_kamar_kos', 'id_kos', 'tanggal_bayar'])
            .skip(Number(skip))
        .limit(Number(limit))

        const data_user = data.map(e=>(e.id_user))
        const data_kamar_kos = data.map(e=>(e.id_kamar_kos))
        const data_kos = data.map(e=>(e.id_kos))

        const penjaga = await Users.find({_id: 
            {$in: data_user}
        }).select(['_id', 'name', 'number_phone', 'avatar'])
        
        const kos = await Kos.find({_id: 
            {$in: data_kos}
        }).select(['_id', 'name'])

        // const kamarkos = await KamarKos.find({_id: 
        //     {$in: data_kamar_kos}
        // }).select(['_id', 'name', 'price', 'id_kos'])
        const kamarkos = await KamarKos.find({ available: 0 })
        .select(['name', 'id_kos', 'name', 'price'])
        const kos2 = await Kos.find({}).select(['_id', 'name'])
        const km = kamarkos.map(e => {
            const match = kos2.find(f => f._id.toString() == e.id_kos)
            if (match) {
                return {}
                // return { id_kos_id_kamar_kos: `${match._id}_${e._id}`, name: `${match.name} - ${e.name}` }
            }
        })

        // const kamarkos2 = await useFetch('/api/v1/public/all-kamar-kos',{
        //     method: 'get', query: {onlyName: 1}
        // })
        
        // @ts-ignore
        data = data.map((e,idx)=>{
            const p = penjaga.find((f:any)=>f._id == e.id_user)
            const k = kos.find((f:any)=>f._id == e.id_kos)
            const km = kamarkos.find((f:any)=>f._id == e.id_kamar_kos)

            if(p != undefined && k != undefined && km != undefined){
                return {num:Number(skip)+idx+1, name: p.name, avatar:p.avatar, kos: k.name, 
                    number_phone: p.number_phone, kamar:km.name, price: km.price, 
                    id_user:e.id_user, id_kamar_kos: e.id_kamar_kos, id_kos:e.id_kos,
                    tanggal_bayar: e.tanggal_bayar, id: e._id}
                }
        })


        return { status: 'success', total: length, data: data }


    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})