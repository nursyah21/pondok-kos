import mongoose from "npm:mongoose"
import {PenghuniKos} from "./penghuni_kos.ts"
// import ofetch from "npm:ofetch"
const time = "00 14 * * *" // because we use gmt +7
// const MONGODB="mongodb+srv://newuser:0VIi4qyPvjYOSuRl@cluster0.l66eexv.mongodb.net/kos-jaya-test"

const MONGODB = "mongodb://admin:password@localhost:27017/kos-jaya-test?authSource=admin"
const FONTEE = "pbXqWfnmHHdxhfqrvRj1"
const target = "089529456271"
const message = "hi jjj"
let alreadysent = true


await mongoose.connect(MONGODB).then(() => {
  console.log('connected to mongodb')
}).catch((e) => console.log(e))
const res = await PenghuniKos.find({})
console.log(res)


Deno.cron("check time", time, async () => {
  if (alreadysent) return  

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      'Authorization': FONTEE,
    },
    body: JSON.stringify({
      target, message, countryCode: '62'
    })
  })
  console.log(await res.text())
  alreadysent = true

})