// @ts-ignore
import Midtrans from "midtrans-client";

const config = useRuntimeConfig()
const isProduction = config.midtransProduction
const serverKey = isProduction ? config.midtransServer : config.midtransServerSandbox
const clientKey = isProduction ? config.midtransClient : config.midtransClientSandbox

const snap = new Midtrans.Snap({
    isProduction,
    serverKey,
    clientKey
});

const midtransCheckStatus = (notificationJson: any, id:string, id_kamar:string) => {
    snap.transaction.notification(notificationJson)
        .then(async (statusResponse: any) => {
            let orderId = statusResponse.order_id;
            let transactionStatus = statusResponse.transaction_status;
            let fraudStatus = statusResponse.fraud_status;
            

            // Sample transactionStatus handling logic

            if (transactionStatus == 'capture') {
                // capture only applies to card transaction, which you need to check for the fraudStatus
                if (fraudStatus == 'challenge') {
                    // TODO set transaction status on your databaase to 'challenge'
                } else if (fraudStatus == 'accept') {
                    // TODO set transaction status on your databaase to 'success'
                    
                    await Booking.findByIdAndUpdate(id, {paid_status: 2})
                    
                    await KamarKos.findByIdAndUpdate(id_kamar, {available: 2})
                    // await KamarKos.findByIdAndUpdate(booking.id_kamar_kos, {available: 2})
                }
            } else if (transactionStatus == 'settlement') {
                await Booking.findByIdAndUpdate(id, {paid_status: 2})
                await KamarKos.findByIdAndUpdate(id_kamar, {available: 2})
                // TODO set transaction status on your databaase to 'success'
            } else if (transactionStatus == 'deny') {
                // TODO you can ignore 'deny', because most of the time it allows payment retries
                // and later can become success
            } else if (transactionStatus == 'cancel' ||
                transactionStatus == 'expire') {                
                await Booking.findByIdAndUpdate(id, {paid_status: 0})
                // diubah secara manual melalui check expire
                // await KamarKos.findByIdAndUpdate(id_kamar, {available: 0})
                // TODO set transaction status on your databaase to 'failure'
            } else if (transactionStatus == 'pending') {
                // TODO set transaction status on your databaase to 'pending' / waiting payment
            }
        });
}


export const checkBooking = async () => {
    try {
        let allmidtrans = await Booking.find().select(['midtrans','id_kamar_kos'])
        
        allmidtrans.forEach((e) => {
            if(e.midtrans){
                midtransCheckStatus(e.midtrans, e._id.toString(), e.id_kamar_kos)
            }
        })


        let data = await Booking.find({
            paid_status: 1, createdAt: {
                $lt: new Date(Date.now() - 60 * 60 * 1000)
            }
        }, { paid_status: 0 }).select(['id_kamar_kos'])

        data.find(async e => {
            const kos = await KamarKos.findByIdAndUpdate(e.id_kamar_kos, { available: 0 })
            const booking = await Booking.findByIdAndUpdate(e._id, { paid_status: 0 })
        })

    } catch (error: any) {
        console.error(error.message)
    }

}