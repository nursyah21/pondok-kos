import moment from "moment";
import { formatRupiahIntl } from "~/utils/formatRupiah";

export default defineEventHandler(async (event) => {
    // const { token } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]
    try {
        checkBooking()
        const refreshTokens = await RefreshTokens.findOne({ token })

        if (!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')

        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        const { role, verified, name } = user

        let skip = getRequestURL(event).searchParams.get('skip')
        let limit = getRequestURL(event).searchParams.get('limit')
        let q = getRequestURL(event).searchParams.get('q')
        let filter = getRequestURL(event).searchParams.get('filter')
        let sort = getRequestURL(event).searchParams.get('sort')
        let size = getRequestURL(event).searchParams.get('sort')

        // cari berdasarkan role
        let query = role == 0 ? { id_user: refreshTokens.id_user } :
            role == 1 ? { id_admin: refreshTokens.id_user } : {}

        const length = await Booking.find(query).countDocuments()

        // cari berdasarkan nama
        const queryUser = {}

        let _User = await Users.find(queryUser).select(['_id', 'name', 'number_phone'])

        // @ts-ignore
        _User = _User.map(e => {
            return { id_user: e._id.toString(), name: e.name, number_phone: e.number_phone }
        })
        const userName = await Users.find({
            name: {
                $regex: /peng/, $options: 'i'
            }
        })


        query = q ? {
            // @ts-ignore
            ...query, 'id_user.name':
                { $regex: new RegExp(q, 'i') }
        } : { ...query }

        const _data = await Booking.find(query)
            .populate(['id_user', { path: 'id_kamar_kos', populate: ['id_kos'] }])
            .sort()
            .skip(Number(skip)).limit(Number(limit))


        const data = _data.map((e: any, idx) => {
            return {
                num: idx + 1,
                user_name: e.id_user.name,
                name_kos: e.id_kamar_kos.id_kos.name,
                name_kamar: e.id_kamar_kos.name,
                price: 'Rp' + formatRupiahIntl(e.price),
                link_payment: e.link_payment ?? '-',
                method_payment: e.method_payment,
                paid_status: e.paid_status == 0 ? 'gagal' : e.paid_status == 1 ? 'menunggu' : 'sukses',
                tgl: moment(e.updatedAt).format('DD-MM-YYYY'),

            }
        })

        return { status: 'success', total: length, data }
    } catch (error: any) {
        event.node.res.statusCode = 400
        console.error(new Date().toLocaleTimeString(), 'error', error.message)
        return { status: 'fail', message: error.message }
    }

})