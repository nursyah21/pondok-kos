import { checkBooking } from "~/server/utils/checkBooking";

export default defineEventHandler(async (event) => {
    const { token } = await readBody(event)
    

    try {
        checkBooking()
        const refreshTokens = await RefreshTokens.findOne({token})

        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
            
        const { role, verified } = user

        let skip = getRequestURL(event).searchParams.get('skip')
        let limit = getRequestURL(event).searchParams.get('limit')
        

        const length = await Booking.find(role == 0 ? {id_user: refreshTokens.id_user} : {}).countDocuments()
        let data = await Booking.find(role == 0 ? {id_user:refreshTokens.id_user} : {})
        .skip(Number(skip)).limit(Number(limit))
        


        const _Kos = await Kos.find({}).select(['_id','name'])
        let _KamarKos = await KamarKos.find({}).select(['_id','name','id_kos'])
        
        // @ts-ignore
        _KamarKos = _KamarKos.map(e=>{
            let name_kos = _Kos.find((f:any)=>f._id == e.id_kos)
            if(name_kos){
                // @ts-ignore
                name_kos = `${name_kos.name} - ${e.name}`
                return {id_kamar_kos:e._id.toString(), name_kamar_kos:name_kos}
            }
        })
        
        let _User = await Users.find({}).select(['_id','name', 'number_phone'])
        // @ts-ignore
        _User = _User.map(e=>{
            return {id_user: e._id.toString(), name: `${e.name} - ${e.number_phone}`}
        })

        // @ts-ignore
        data = data.map((e,idx)=>{
            const kamarKos = _KamarKos.find((f:any)=>f.id_kamar_kos == e.id_kamar_kos)
            const admin = _User.find((f:any)=>f.id_user == e.id_admin)
            const user = _User.find((f:any)=>f.id_user == e.id_user)
            // if(!admin || !user) throw new Error('admin or user not found')
            if(admin && user){
                return {_id: e._id,num:Number(skip)+idx+1, midtrans: e.midtrans, method_payment: e.method_payment, id_admin: e.id_admin, 
                    admin_name: admin.name, id_user: e.id_user, user_name:user.name, 
                    ...kamarKos, price: e.price, paid_status: e.paid_status, link_payment: e.link_payment, 
                    createdAt: e.createdAt, attachment: e.attachment}
            }
        })
        return {status: 'success', total: length, data }
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(new Date().toLocaleTimeString(), 'error',error.message)
        return { status: 'fail', message: error.message }
    }

})