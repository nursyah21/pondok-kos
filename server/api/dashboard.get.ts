import { formatRupiahIntl } from "~/utils/formatRupiah";
import moment from "moment";

export default defineEventHandler(async (event) => {
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    try {
        checkBooking()
        const refreshTokens = await RefreshTokens.findOne({ token })

        if (!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')

        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')
        const { role, _id } = user
        let data: DataDashboard = {};
        // pemilik
        if (role == 2) {
            const totalPenghuni = (await PenghuniKos.find({}).countDocuments()).toString()
            const totalPenjaga = (await PenjagaKos.find({}).countDocuments()).toString()
            const totalKamarKos = (await KamarKos.find({}).countDocuments()).toString()

            const temp = await PenghuniKos.find({}).populate(['id_kamar_kos']).select('id_kamar_kos').limit(10)
            let pendapatan = 0
            temp.forEach((e: any) => {
                pendapatan += e?.id_kamar_kos?.price ?? 0
            })
            const listpenghuni: any[] = []
            const _listpenghuni = await PenghuniKos.find({}).populate(['id_kamar_kos', 'id_user', 'id_kos']).limit(10)

            let num = 1
            _listpenghuni.forEach((e: any) => {
                listpenghuni.push({
                    num,
                    name: e.id_user.name,
                    kos: e.id_kos.name,
                    kamar: e.id_kamar_kos.name,
                    tanggal_bayar: moment(e.tanggal_bayar).format('DD-MM-YYYY')
                })
                num++
            })


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
                listPenghuni: listpenghuni
            }
        }
        // penjaga
        if (role == 1) {
            const penjagakos = await PenjagaKos.find({ id_user: _id }).populate(['id_kos']).limit(10)
            const _listkos: any[] = []
            const _listpenghuni: any[] = []
            const idkos: any[] = []
            penjagakos.forEach((e: any) => {
                idkos.push(e.id_kos._id.toString())
                _listkos.push({
                    kos: e.id_kos.name,
                    address: e.id_kos.address,
                    imgkos: e.id_kos.image
                })
            })
            const penghuni = await PenghuniKos.find({}).populate(['id_user', 'id_kos', 'id_kamar_kos']).limit(10)
            let num = 1
            penghuni.forEach((e: any) => {
                if (idkos.indexOf(e.id_kos._id.toString()) === -1) {
                    return
                }
                _listpenghuni.push({
                    num,
                    name: e.id_user.name,
                    kos: e.id_kos.name,
                    kamar: e.id_kamar_kos.name,
                    tanggal_bayar: moment(e.tanggal_bayar).format('DD-MM-YYYY')
                })
                num++
            })


            data = {
                listKos: _listkos,
                listPenghuni: _listpenghuni
            }
        }
        // penghuni
        if (role == 0) {
            const penghuni = await PenghuniKos.find({ id_user: { _id } }).populate(['id_user', 'id_kos', 'id_kamar_kos']).limit(10)

            const listKos: any[] = []
            const listTransaksi: any[] = []

            penghuni.forEach((e: any) => {
                listKos.push({
                    kos: e.id_kos.name,
                    address: e.id_kos.address,
                    imgkos: e.id_kos.image
                })
            })

            const booking = await Booking.find({ id_user: _id }).populate([
                { path: 'id_kamar_kos', populate: ['id_kos'] }
            ])
            booking.forEach((e: any, idx) => {
                listTransaksi.push({
                    num: idx + 1,
                    kos: e.id_kamar_kos.name,
                    kamar: e.id_kamar_kos.id_kos.name,
                    price: 'Rp' + formatRupiahIntl(e.price),
                    tanggal_bayar: moment(e.updatetAt).format('DD-MM-YYYY')
                })
                console.log(e.id_kamar_kos.id_kos)
            })

            data = {
                listKos,
                listTransaksi
            }
        }


        return { status: 'success', data }
    } catch (error: any) {
        event.node.res.statusCode = 400
        writeError(error.message)

        return { status: 'fail', message: error.message }
    }

})