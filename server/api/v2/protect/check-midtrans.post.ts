// @ts-ignore
import Midtrans from "midtrans-client";

export default defineEventHandler(async (event) => {
    const { data } = await readBody(event)
    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]

    const config = useRuntimeConfig()
    const isProduction = config.midtransProduction
    const serverKey = isProduction ? config.midtransServer : config.midtransServerSandbox
    const clientKey = isProduction ? config.midtransClient : config.midtransClientSandbox

    const snap = new Midtrans.Snap({
        isProduction, 
        serverKey, 
        clientKey 
    });

    try {
        const refreshTokens = await RefreshTokens.findOne({token})
        if(!refreshTokens || !refreshTokens.id_user) throw new Error('token not valid')
        const user = await Users.findById(refreshTokens.id_user)
        if (!user) throw new Error('user not valid')

        let paid_status;
        let available;

        snap.transaction.notification(data)
            .then((statusResponse:any)=>{
                let orderId = statusResponse.order_id;
                let transactionStatus = statusResponse.transaction_status;
                let fraudStatus = statusResponse.fraud_status;

                (`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

                if (transactionStatus == 'settlement'){
                    // TODO set transaction status on your databaase to 'success'
                    paid_status = 2
                    available = 2
                } else if (transactionStatus == 'deny'){
                    // TODO you can ignore 'deny', because most of the time it allows payment retries
                    // and later can become success
                    paid_status = 1
                    available = 1
                } else if (transactionStatus == 'cancel' || transactionStatus == 'expire'){
                    // TODO set transaction status on your databaase to 'failure'
                    paid_status = 0
                    available = 0
                } else if (transactionStatus == 'pending'){
                    // TODO set transaction status on your databaase to 'pending' / waiting payment
                    paid_status = 1
                    available = 1
                }
            })

        
        await Booking.findOneAndUpdate({midtrans: {_data:''}}, {midtrans: {...data}})
        

        if(available != 1){
            const booking = await Booking.findOneAndUpdate({order_id: data.order_id}, {paid_status: paid_status})
            if(!booking) throw new Error('booking sudah tidak tersedia');
            await KamarKos.findByIdAndUpdate(booking.id_kamar_kos, {available: available})
        }

        return {status: 'success', message: {paid_status, available}}
    } catch (error:any) {
        event.node.res.statusCode = 400
        console.error(error.message)
        return { status: 'fail', message: error.message }
    }

})