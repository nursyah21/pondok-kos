export default defineEventHandler(async (event) => {
    const { token } = await readBody(event)
    

    try {
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')            
        if (!user) throw new Error('user not valid')
        const { role } = user
        if (role == 0) throw new Error('user not authorization')
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')

        // if onlyName == 1, return all user but only id and name, number_phone
        const onlyName = getRequestURL(event).searchParams.get('onlyName')

        let data;

        if(onlyName == '1'){
            data = await Users.find({role: 0, verified: true}).select(['name', 'number_phone'])
            return { status: 'success', data: data }
        }
        
        const length = await Users.find({
            role:{$in: [1,0]}
        }).countDocuments()

        const query = role == 2 ? {$in: [1,0]} : 0

        data = await Users.find({role: query})
            .select(['name', 'number_phone','avatar','id_card','address','verified','createdAt','birthdate', 'role'])
            .skip(Number(skip))
            .limit(Number(limit));

        // @ts-ignore        
        data = data.map((e,idx)=>{
            return {num:Number(skip)+idx+1, id:e._id, name:e.name, number_phone: e.number_phone, role:e.role, avatar: e.avatar, id_card: e.id_card, address: e.address, created_at: e.createdAt, birthdate: e.birthdate, verified: e.verified }
        })

        

        return { status: 'success', total: length, data: data }


    } catch (error:any) {
        console.error(error.message)
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})