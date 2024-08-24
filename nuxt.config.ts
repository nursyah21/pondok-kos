// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxt/ui",  "@nuxt/test-utils/module"],
  colorMode: {
    preference: 'light', // Set preference to 'light'
    // Other colorMode options (optional)
  },
  runtimeConfig: {
    "mongodb": process.env.MONGODB,
    "secret": process.env.NUXT_SESSION_PASSWORD,
    "midtransProduction": false,
    "midtransServer": process.env.MIDTRANS_SERVER,
    "midtransClient": process.env.MIDTRANS_CLIENT,
    "midtransServerSandbox": process.env.MIDTRANS_SERVER_SANDBOX,
    "midtransClientSandbox": process.env.MIDTRANS_CLIENT_SANDBOX,
    "r2AccessKey": process.env.R2_ACCESS_KEY,
    "r2SecretKey": process.env.R2_SECRET_KEY,
    "r2Endpoint": process.env.R2_ENDPOINT,
    "r2Bucket": process.env.R2_BUCKET,
    "r2PublicPath": process.env.R2_PUBLIC_PATH,
    "fontee": process.env.FONTEE,
    public: {
      "midtransProduction": false,
      "midtransClientSandbox": process.env.MIDTRANS_CLIENT_SANDBOX,
      "midtransClient": process.env.MIDTRANS_CLIENT,
    }
  }
})
