import mongoose from 'mongoose'
import argon2 from 'argon2'
import {Kos} from './server/utils/models/kos'
import {Users} from './server/utils/models/users'
import dotenv from 'dotenv'
dotenv.config({path:''})

await mongoose.connect(process.env.MONGODB ?? '');
console.log('connected to db')

const linkImageKamar = [
    "https://static.mamikos.com/uploads/cache/data/style/2023-04-20/pfIeVtm1-360x480.jpg",
    "https://static.mamikos.com/uploads/cache/data/style/2020-01-27/G27XIejP-360x480.jpg",
    "https://blog-static.mamikos.com/wp-content/uploads/2021/08/Kost-Singgahsini-Taisir-Residence-BINUS-Tipe-A-Palmerah-Jakarta-Barat.jpg",   
    "https://static.mamikos.com/uploads/cache/data/style/2020-03-03/6OjGSeqs-360x480.jpg",
    "https://static.mamikos.com/uploads/cache/data/style/2022-07-19/L8BRhln7-360x480.jpg"
]

const linkImageProfile = [
    "https://pics.craiyon.com/2023-10-25/b65f72d6d11a48c1bc560059cc36e31f.webp",
    "https://priv.au/image_proxy?url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcRUGMk0nDUqb0t8E9aRW8Fwfw9vroYJFCZXOSXLAAUTbl2USsuI%26s&h=870becf5693660ca9bc54a771268f4dd21ed2617c6ac99a29eae5ba8a3bcf960",
    "https://priv.au/image_proxy?url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcSzl5R-9727qrUHMP4IPcXHqcj7pStolo4Yxnk1ELruTq9BBLlx%26s&h=91b839201b42c2ea59cc7f2163da4df30ddf46c31725a9c1c9cd0eb8c313e627",
    "https://priv.au/image_proxy?url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTz6YdwSwjyjtrW4Ntyg2pc0SA-zDhy9V8beK6CLkb2-qYELrdR%26s&h=fad4e62177084cb86813da24b53f14e6e032b9a9778347846979ac951716733d",
    "https://pics.craiyon.com/2023-10-19/ebd05cc8b06f4c439bccef6994f74fc1.webp"
]

const random = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

const makePassword = async (password:string) => await argon2.hash(password, {
    type: argon2.argon2d,
    memoryCost: 2 ** 10, // 1mb
    hashLength: 50,
})


const kosData = [
    { name: 'Kos Ketintang', description: 'Hunian asri dekat kampus', address: 'Jl. Ketintang, Surabaya' },
    { name: 'Kos Putri Mentari', description: 'Nyaman dan strategis', address: 'Jl. Diponegoro, Semarang' },
    { name: 'Kost Putra Nusantara', description: 'Fasilitas lengkap', address: 'Jl. Gatot Subroto, Jakarta' },
    { name: 'Kost Keluarga Bahagia', description: 'Cocok untuk keluarga kecil', address: 'Jl. Ahmad Yani, Bandung' },
    { name: 'Kost Eksklusif Alam Sutera', description: 'Lingkungan tenang', address: 'Alam Sutera, Tangerang' },
    { name: 'Kost Syariah Putri', description: 'Kamar bersih dan nyaman', address: 'Jl. Sultan Agung, Yogyakarta' },
    { name: 'Kost Coliving Modern',  description: 'Konsep coliving kekinian', address: 'Jl. Sudirman, Jakarta' },
    { name: 'Kost Mahasiswa Malang', description: 'Dekat dengan universitas', address: 'Jl. Veteran, Malang' },
    { name: 'Kost Mewah Bali', description: 'View pantai yang indah', address: 'Kuta, Bali' },
    { name: 'Kost Transit Medan', description: 'Sangat strategis', address: 'Jl. Gatot Subroto, Medan' }
].map(items=>({...items, image: random(linkImageKamar)}));

const userData = [
    {name: 'pemilik', role: 2, password: makePassword('password'), number_phone: '081234567890'},
    {name: 'penjaga1', role: 1, password: makePassword('password'), number_phone: '081234567891'},
    {name: 'penjaga2', role: 1, password: makePassword('password'), number_phone: '081234567892'},
    {name: 'penjaga3', role: 1, password: makePassword('password'), number_phone: '081234567893'},
    {name: 'penghuni1', role: 0, password: makePassword('password'), number_phone: '081234567894', verified: true},
    {name: 'penghuni2', role: 0, password: makePassword('password'), number_phone: '081234567895'},        
    {name: 'penghuni3', role: 0, password: makePassword('password'), number_phone: '081234567896'},
    {name: 'penghuni4', role: 0, password: makePassword('password'), number_phone: '081234567897', verified: true},
    {name: 'penghuni5', role: 0, password: makePassword('password'), number_phone: '081234567898', verified: true},
    {name: 'penghuni6', role: 0, password: makePassword('password'), number_phone: '081234567899', verified: true},
].map(items=>({...items, avatar: random(linkImageProfile)}));

await Users.deleteMany({})
await Users.insertMany(userData).catch(e=>{
    console.log(e.message)
})

await Kos.deleteMany({})
await Kos.insertMany(kosData).catch(e=>{
    console.log(e.message)
})

await mongoose.disconnect()
console.log('finish seeding users, kos')