export default defineEventHandler(async (event) => {

    try {
        checkBooking()
        
        await checkBooking()
        
        const id_kos = getRequestURL(event).searchParams.get('id_kos')
        const q = getRequestURL(event).searchParams.get('q')
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const sort = getRequestURL(event).searchParams.get('sort') ?? 'asc'
        const filter = getRequestURL(event).searchParams.get('filter') ?? ''        
        const only = getRequestURL(event).searchParams.get('only')
        const onlyName = getRequestURL(event).searchParams.get('onlyName')

        if (onlyName == '1') {
            
            const kamar = await KamarKos.find({ available: 0 }).populate({
                path:'id_kos', select: 'name address hidden'
            })

            const data = kamar.filter((e:any)=> e.id_kos.hidden != true)
            .map((e,idx)=> {
                const {_id:id, name:kamar, description, price, price_harian, image, hidden, available, createdAt} = e
                // @ts-ignore
                const {_id: id_kos, name: kos, address} = e.id_kos
    
                return {
                    id,kamar,description,price,price_harian,image,hidden,createdAt,
                    id_kos, kos, address, available,
                    num:idx+1+Number(skip)
                }
            })

            return { status: 'success', data }
        }

        const queryName = q ? {
            name:  new RegExp(q, 'i'),
        } : {}
        
        const queryHidden = filter != 'all' ? {
            hidden: filter != 'aktif'
        } : {}

        const queryAvailable = filter == 'dibooking' ? {
            available: 1
        } : filter == 'ditempati' ? {available: 2} : {}
        const queryId = id_kos ? { id_kos } : {}

        const query = {...queryName, ...queryHidden, ...queryAvailable, ...queryId}

        const length = await KamarKos.find(query).countDocuments()

        const data = await KamarKos.find(query)
            .populate({
                path:'id_kos', select: 'name address hidden'
            })
            .sort({ available: 1 })
            .skip(Number(skip))
        .limit(Number(limit));
        
        const _data = data.filter((e:any)=> e.id_kos.hidden != true)
        .map((e,idx)=> {
            const {_id:id, name:kamar, description, price, price_harian, image, hidden, createdAt, available} = e
            // @ts-ignore
            const {_id: id_kos, name: kos, address} = e.id_kos

            return {
                id,kamar,description,price,price_harian,image,hidden,createdAt,
                available, id_kos, kos, address, 
                num:idx+1+Number(skip)
            }
        })

        // @ts-ignore
        return { status: 'success', total: length, data: _data }
    } catch (error: any) {
        if (error) {
            console.error('all-kamar-kos.get.ts', error)
        }
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})