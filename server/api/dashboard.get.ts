import { formatRupiahIntl } from "~/utils/formatRupiah";

export default defineEventHandler(async (event) => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        checkBooking()
        const refreshTokens = await RefreshTokens.findOne({ token })

        if (!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')

        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        const { role } = user

        // penghuni
        const totalPenghuni = (await PenghuniKos.find({}).countDocuments()).toString()
        const totalPenjaga = (await PenjagaKos.find({}).countDocuments()).toString()
        const totalKamarKos = (await KamarKos.find({}).countDocuments()).toString()

        const temp = await PenghuniKos.find({}).populate(['id_kamar_kos']).select('id_kamar_kos')
        let pendapatan = 0
        temp.forEach((e: any) => {
            pendapatan += e?.id_kamar_kos?.price ?? 0
        })
        const listpenghuni = await PenghuniKos.find({}).populate(['id_kamar_kos','id_user'])        

        let data: DataDashboard;
        data = {
            totalPenghuni,
            totalPenjaga,
            totalKamarKos,
            pendapatan,
            chartBarPendapatan: {
                options: {
                    chart: {
                        type: 'bar'
                    }
                },
                series: [{
                    data: [
                        { x: 'jan', y: 100 },
                        { x: 'feb', y: 100 },
                        { x: 'mar', y: 100 },
                        { x: 'apr', y: 100 },
                        { x: 'mei', y: 100 },
                        { x: 'jun', y: 100 },
                        { x: 'jul', y: 100 },
                        { x: 'agu', y: 100 },
                        { x: 'sep', y: 100 },
                        { x: 'okt', y: 100 },
                        { x: 'nov', y: 100 },
                        { x: 'dec', y: 100 },
                    ]
                }]
            },
            listpenghuni
        }

        return { status: 'success', data }
    } catch (error: any) {
        event.node.res.statusCode = 400
        writeError(error.message)

        return { status: 'fail', message: error.message }
    }

})