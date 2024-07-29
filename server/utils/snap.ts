// @ts-ignore
import Midtrans from "midtrans-client";

 // prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
const config = useRuntimeConfig()
const isProduction = config.midtransProduction
const serverKey = isProduction ? config.midtransServer : config.midtransServerSandbox
const clientKey = isProduction ? config.midtransClient : config.midtransClientSandbox

export const snap = new Midtrans.Snap({
    isProduction,
    serverKey,
    clientKey
});