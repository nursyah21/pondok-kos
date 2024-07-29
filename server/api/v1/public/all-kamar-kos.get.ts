export default defineEventHandler(async (event) => {

    try {
        checkBooking()
        const id_kos = getRequestURL(event).searchParams.get('id_kos')

        await checkBooking()

        if (id_kos) {
            try {
                await Kos.findById(id_kos)
            } catch (error) {
                throw new Error(`${id_kos} not exist`)
            }
        }
        
        const skip = getRequestURL(event).searchParams.get('skip')
        const limit = getRequestURL(event).searchParams.get('limit')
        const onlyName = getRequestURL(event).searchParams.get('onlyName')

        if (onlyName == '1') {
            const kos = await Kos.find({}).select(['_id', 'name'])
            const kamar = await KamarKos.find({ available: 0 })
                .select(['name', 'id_kos'])
            


            const data = kamar.map(e => {
                const match = kos.find(f => f._id.toString() == e.id_kos)
                if (match) {
                    return { id_kos_id_kamar_kos: `${match._id}_${e._id}`, name: `${match.name} - ${e.name}` }
                }
            })
            return { status: 'success', data }
        }

        const length = await KamarKos.find(id_kos ? { id_kos } : {}).countDocuments()


        let penghunikos = await PenghuniKos.find()
            .select(['id_kamar_kos', 'id_user'])

        let data = await KamarKos.find(id_kos ? { id_kos } : {})
            .sort({ available: 1 })
            .select(['name', 'description', 'available', 'price', 'id_kos', 'image', 'created_at'])
            .skip(Number(skip))
            .limit(Number(limit))


        let location = await Kos.find({}).select(['_id', 'location', 'name'])
        // @ts-ignore
        location = location.map(e => ({ id_kos: e._id.toString(), location: e.location, kos: e.name }))

        // @ts-ignore
        data = data.map((e, idx) => {
            const match = location.find((f: any) => f.id_kos == e.id_kos)
            return {
                num: Number(skip) + idx + 1, id: e._id,
                // @ts-ignore
                name: e.name, description: e.description,
                available: e.available, price: e.price,
                image: e.image, ...match
            }
        })

        // @ts-ignore
        return { status: 'success', total: length, data: data }
    } catch (error: any) {
        if (error) {
            console.error('all-kamar-kos.get.ts', error)
        }
        event.node.res.statusCode = 400
        return { status: 'fail', message: error.message }
    }

})