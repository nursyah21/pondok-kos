export default defineEventHandler(async (event) => {
    // prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
    const { parameter } = await readBody(event);
    
    let res = "";
    
    await snap.createTransaction(parameter)
        //   @ts-ignore
        .then((transaction) => {
            res = transaction.redirect_url;
        })
        // @ts-ignore
        .catch((e) => {
            console.log('midtranst.post', e.message)
            throw createError({
                statusCode: 500,
                statusMessage: e.message,
            });
        });

    
    return res
});
