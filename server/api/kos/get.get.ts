export default defineEventHandler(async (event) => {

    try {
        
        const q = getRequestURL(event).searchParams.get('q')
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const sort = getRequestURL(event).searchParams.get('sort') ?? 'asc'
        const filter = getRequestURL(event).searchParams.get('filter') ?? ''        
        const only = getRequestURL(event).searchParams.get('only') ?? ''        

        if(only == 'name'){
            return await Kos.find({hidden: false}).select(['name'])
        }

        const queryName = q ? {
            name:  new RegExp(q, 'i'),
        } : {}
        
        const queryHidden ={}
        // = filter != 'all' ? {
        //     hidden: filter != 'aktif'
        // } : {}

        const length = await Kos.find({...queryName, ...queryHidden}).countDocuments()

        let data = await Kos.find({...queryName, ...queryHidden})
        .sort({createdAt: sort == 'asc' ? -1 : 1})
        .skip(Number(skip))
        .limit(Number(limit));
        

        // @ts-ignore
        data = data.map((e, idx)=>({num:idx+1+Number(skip), _id: e._id, name: e.name, 
            description: e.description, address: e.address, image: e.image, hidden: e.hidden}));
        
        return { status: 'success', total: length, data: data }
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})