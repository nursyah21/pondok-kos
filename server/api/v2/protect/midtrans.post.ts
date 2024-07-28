// @ts-ignore
import Midtrans from "midtrans-client";

export default defineEventHandler(async (event) => {
    // prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
    const { parameter } = await readBody(event);
    const config = useRuntimeConfig()
    const isProduction = config.midtransProduction
    const serverKey = isProduction ? config.midtransServer : config.midtransServerSandbox
    const clientKey = isProduction ? config.midtransClient : config.midtransClientSandbox
    //: false, //process.env.NODE_ENV === "production", //useRuntimeConfig().midtransProduction,
    const snap = new Midtrans.Snap({
        isProduction, 
        serverKey, 
        clientKey 
    });

    
    let res = "";
    
    await snap.createTransaction(parameter)
        //   @ts-ignore
        .then((transaction) => {
            res = transaction.redirect_url;
        })
        // @ts-ignore
        .catch((e) => {
            throw createError({
                statusCode: 500,
                statusMessage: e.message,
            });
        });

    
    return res
});
