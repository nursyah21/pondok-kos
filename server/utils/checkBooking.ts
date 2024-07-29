
const midtransCheckStatus = async (notificationJson: any, id_booking: string, id_kamar: string) => {
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

                await Booking.findByIdAndUpdate(id_booking, { paid_status: 2 })
                await KamarKos.findByIdAndUpdate(id_kamar, { available: 2 })                
            }
        } else if (transactionStatus == 'settlement') {

            await Booking.findByIdAndUpdate(id_booking, { paid_status: 2 })
            await KamarKos.findByIdAndUpdate(id_kamar, { available: 2 })
            // TODO set transaction status on your databaase to 'success'
        } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {

            await Booking.findByIdAndUpdate(id_booking, { paid_status: 0 })            
            await KamarKos.findByIdAndUpdate(id_kamar, { available: 0 })
            // TODO set transaction status on your databaase to 'failure'
        }
    } catch (error: any) {
        console.log(error)
    }

}


export const checkBooking = async () => {
    try {
        let allmidtrans = await Booking.find({ paid_status: 1 })
        
        allmidtrans.forEach((e) => {
            if (e.midtrans) {
                // console.log(e.midtrans, e._id.toString(), e.id_kamar_kos)
                midtransCheckStatus(e.midtrans, e._id.toString(), e.id_kamar_kos)
            }
        })


        // let data = await Booking.find({
        //     paid_status: 1, createdAt: {
        //         $lt: new Date(Date.now() - 60 * 60 * 1000)
        //     }
        // }, { paid_status: 0 }).select(['id_kamar_kos'])

        // data.find(async e => {
        //     const kos = await KamarKos.findByIdAndUpdate(e.id_kamar_kos, { available: 0 })
        //     const booking = await Booking.findByIdAndUpdate(e._id, { paid_status: 0 })
        // })

    } catch (error: any) {
        console.error(error.message)
    }

}