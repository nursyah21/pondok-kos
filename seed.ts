import mongoose from 'mongoose'
import {Kos} from './server/utils/models/kos'
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

const random = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

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

await Kos.deleteMany({})
await Kos.insertMany(kosData).catch(e=>{
    console.log(e.message)
})

await mongoose.disconnect()
console.log('finish')