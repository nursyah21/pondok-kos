export default defineEventHandler(async (event) => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role } = user
        if (role != 2) throw new Error('user not authorization, you must be admin')
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const length = await PenjagaKos.find({}).countDocuments()
        
        
        let data = await PenjagaKos.find({})
            .select(['id_user','id_kos'])
            .skip(Number(skip))
        .limit(Number(limit))

        const data_user = data.map(e=>(e.id_user))
        const data_kos = data.map(e=>(e.id_kos))

        const penjaga = await Users.find({_id: 
            {$in: data_user}
        }).select(['_id', 'name', 'number_phone', 'avatar'])

        const kos = await Kos.find({_id: 
            {$in: data_kos}
        }).select(['_id', 'name', 'address'])
        
        
        
        // @ts-ignore
        data = data.map((e,idx)=>{
            const p = penjaga.find((f:any)=>f._id == e.id_user)
            const k = kos.find((f:any)=>f._id == e.id_kos)
            
            if(p != undefined && k != undefined){
                return {num:Number(skip)+idx+1, name: p.name, avatar:p.avatar, kos: k.name, 
                    number_phone: p.number_phone, location: k.address, _id: e._id}
                }
        })

        return { status: 'success', total: length, data: data }


    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})