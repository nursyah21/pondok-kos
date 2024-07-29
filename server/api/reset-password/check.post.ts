import checkTime from '~/utils/checkTime'

export default defineEventHandler(async (event)=>{
    const {secret} = await readBody(event)
    
    try {
        // check id_reset if already 24 hour or  return not valid
        const exist = await ResetPassword.findOne({secret_key:secret})        
        if(!exist) throw new Error(`secret tidak valid`);

        const timeLimit = new Date(new Date().getTime() - 24*60*60*1000)
        const createdAt = new Date(exist.createdAt)
        if(createdAt < timeLimit) { // already 24 hour
            throw new Error(`secret tidak valid`)
        }
        if(exist.reset) throw new Error(`secret tidak valid`);
        

        return {status: 'success', message: ''}
    } catch (error:any) {
        event.node.res.statusCode = 400
        return {status: 'fail', message: error.message}
    }
})