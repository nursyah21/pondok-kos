import mongoose, { ObjectId } from "mongoose";

const midtransCheckStatus = async (notificationJson: any, id_booking: any, id_kamar: any, id_user: any, id_kos: any, created_at: any) => {
    try {
        const statusResponse = await snap.transaction.notification(notificationJson)

        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        // Sample transactionStatus handling logic
        if (transactionStatus == 'capture') {
            // capture only applies to card transaction, which you need to check for the fraudStatus
            if (fraudStatus == 'challenge') {
                // TODO set transaction status on your databaase to 'challenge'
            } else if (fraudStatus == 'accept') {
                await addPenghuniKos(id_booking, id_kamar, id_user, created_at, id_kos);
            }
        } else if (transactionStatus == 'settlement') {

            await addPenghuniKos(id_booking, id_kamar, id_user, created_at, id_kos);
            // TODO set transaction status on your databaase to 'success'
        } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {

            await Booking.findByIdAndUpdate(id_booking, { paid_status: 0 })
            await KamarKos.findByIdAndUpdate(id_kamar, { available: 0 })
            // TODO set transaction status on your databaase to 'failure'
        }
    } catch (error: any) {
        console.error('checkBooking.ts',error)
    }

}


export const checkBooking = async () => {
    try {
        let allmidtrans = await Booking.find({ paid_status: 1 })

        allmidtrans.forEach((e) => {
            if (e.midtrans) {
                midtransCheckStatus(e.midtrans, e._id, e.id_kamar_kos, e.id_user, e.id_admin, e.createdAt)
            }
        })

    } catch (error: any) {
        console.error(error.message)
    }

}

async function addPenghuniKos(id_booking: any, id_kamar: any, id_user: any, created_at: any, id_kos: any) {
    await Booking.findByIdAndUpdate(id_booking, { paid_status: 2 });
    await KamarKos.findByIdAndUpdate(id_kamar, { available: 2 });
    await PenghuniKos.create({ id_user, id_kamar_kos: id_kamar, tanggal_bayar: created_at, id_kos })
}
