export default defineEventHandler(async (event) => {

    try {
        
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const length = await Kos.find().countDocuments()

        let data = await Kos.find()
            .select(['name', 'description','location','image','hidden'])
            .skip(Number(skip))
        .limit(Number(limit));
        

        // @ts-ignore
        data = data.map((e, idx)=>({num:idx+1+Number(skip), _id: e._id, name: e.name, 
            description: e.description, location: e.location, image: e.image, hidden: e.hidden}));
        
        return { status: 'success', total: length, data: data }
    } catch (error:any) {
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})