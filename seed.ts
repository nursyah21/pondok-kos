import mongoose from "mongoose";
import argon2 from "argon2";
import {
  Kos,
  KamarKos,
  Users,
  PenjagaKos,
  Booking,
  RefreshTokens,
} from "./server/utils/models/index.schema";

import dotenv from "dotenv";
dotenv.config({ path: "" });

console.log('connect to', process.env.MONGODB)
await mongoose.connect(process.env.MONGODB ?? "").catch((e) => {
  console.log(e);
});

const linkImageKamar = [
  "https://static.mamikos.com/uploads/cache/data/style/2023-04-20/pfIeVtm1-360x480.jpg",
  "https://static.mamikos.com/uploads/cache/data/style/2020-01-27/G27XIejP-360x480.jpg",
  "https://blog-static.mamikos.com/wp-content/uploads/2021/08/Kost-Singgahsini-Taisir-Residence-BINUS-Tipe-A-Palmerah-Jakarta-Barat.jpg",
  "https://static.mamikos.com/uploads/cache/data/style/2020-03-03/6OjGSeqs-360x480.jpg",
  "https://static.mamikos.com/uploads/cache/data/style/2022-07-19/L8BRhln7-360x480.jpg",
];

const linkImageProfile = [
  "https://pics.craiyon.com/2023-10-25/b65f72d6d11a48c1bc560059cc36e31f.webp",
  "https://scontent.fsub6-4.fna.fbcdn.net/v/t39.30808-6/429548530_122115054008210694_2521757544094032769_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zZGB0QiKMpwQ7kNvgGUtsCu&_nc_zt=23&_nc_ht=scontent.fsub6-4.fna&_nc_gid=AQct93oPuPSwtfcX2UYfLqf&oh=00_AYAIy5Mo3FBhI-BgukFlnygRD7Sq2ST21BCvWpl6F5DfCQ&oe=674435AE",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4fe33b1d-a9d0-4fdb-8d15-0cb7787218aa/dgtudkw-d99f50c3-3a64-4b19-adfd-c7e34fb9a32c.png/v1/fill/w_512,h_512,q_80,strp/cute_anime_girl_smiling_at_viewer___profile_pic_by_louidev_dgtudkw-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvNGZlMzNiMWQtYTlkMC00ZmRiLThkMTUtMGNiNzc4NzIxOGFhXC9kZ3R1ZGt3LWQ5OWY1MGMzLTNhNjQtNGIxOS1hZGZkLWM3ZTM0ZmI5YTMyYy5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.jhAE6ZPO76_OIiNkTTL1AS2xSZLKTMmdwoVvqjB3Cl0",  
  "https://pics.craiyon.com/2023-10-19/ebd05cc8b06f4c439bccef6994f74fc1.webp",
];

const random = (arr: any[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const makePassword = async (password: string) =>
  await argon2.hash(password, {
    type: argon2.argon2d,
    memoryCost: 2 ** 10, // 1mb
    hashLength: 50,
  });

const kosData = [
  {
    name: "Kos Ketintang",
    description: "Hunian asri dekat kampus",
    address: "Jl. Ketintang, Surabaya",
  },
  {
    name: "Kos Putri Mentari",
    description: "Nyaman dan strategis",
    address: "Jl. Diponegoro, Semarang",
  },
  {
    name: "Kost Putra Nusantara",
    description: "Fasilitas lengkap",
    address: "Jl. Gatot Subroto, Jakarta",
  },
  {
    name: "Kost Keluarga Bahagia",
    description: "Cocok untuk keluarga kecil",
    address: "Jl. Ahmad Yani, Bandung",
  },
  {
    name: "Kost Eksklusif Alam Sutera",
    description: "Lingkungan tenang",
    address: "Alam Sutera, Tangerang",
  },
  {
    name: "Kost Syariah Putri",
    description: "Kamar bersih dan nyaman",
    address: "Jl. Sultan Agung, Yogyakarta",
  },
  {
    name: "Kost Coliving Modern",
    description: "Konsep coliving kekinian",
    address: "Jl. Sudirman, Jakarta",
  },
  {
    name: "Kost Mahasiswa Malang",
    description: "Dekat dengan universitas",
    address: "Jl. Veteran, Malang",
  },
  {
    name: "Kost Mewah Bali",
    description: "View pantai yang indah",
    address: "Kuta, Bali",
  },
  {
    name: "Kost Transit Medan",
    description: "Sangat strategis",
    address: "Jl. Gatot Subroto, Medan",
  },
].map((items) => ({ ...items, image: random(linkImageKamar) }));

// pemilik: 081234567890, password
// penjaga: 081234567891, password
// penghuni (verified): 081234567894, password
// penghuni (not verified): 081234567895, password
const userData = [
  {
    name: "pemilik",
    role: 2,
    password: await makePassword("password"),
    number_phone: "081234567890",
  },
  {
    name: "penjaga1",
    role: 1,
    password: await makePassword("password"),
    number_phone: "081234567891",
  },
  {
    name: "penjaga2",
    role: 1,
    password: await makePassword("password"),
    number_phone: "081234567892",
  },
  {
    name: "penjaga3",
    role: 1,
    password: await makePassword("password"),
    number_phone: "081234567893",
  },
  {
    name: "penghuni1",
    role: 0,
    password: await makePassword("password"),
    number_phone: "081234567894",
    verified: true,
  },
  {
    name: "penghuni2",
    role: 0,
    password: await makePassword("password"),
    number_phone: "081234567895",
  },
  {
    name: "penghuni3",
    role: 0,
    password: await makePassword("password"),
    number_phone: "081234567896",
  },
  {
    name: "penghuni4",
    role: 0,
    password: await makePassword("password"),
    number_phone: "081234567897",
    verified: true,
  },
  {
    name: "penghuni5",
    role: 0,
    password: await makePassword("password"),
    number_phone: "081234567898",
    verified: true,
  },
  {
    name: "penghuni6",
    role: 0,
    password: await makePassword("password"),
    number_phone: "081234567899",
    verified: true,
  },
].map((items) => ({ ...items, avatar: random(linkImageProfile) }));

await RefreshTokens.deleteMany({});
await Users.deleteMany({});
await Users.insertMany(userData).catch((e) => {
  console.log(e.message);
});

await Kos.deleteMany({});
await Kos.insertMany(kosData).catch((e) => {
  console.log(e.message);
});

const data = await Kos.find().select("name");
const listIdKos = data.map((e) => e._id);

const kamarKosData = [
  {
    name: "kamar 1",
    description: "Hunian asri dekat kampus",
    price: 300_000,
    price_harian: 40_000,
  },
  {
    name: "kamar 2",
    description: "Hunian asri dekat kampus",
    price: 500_000,
    price_harian: 50_000,
  },
  {
    name: "kamar 3",
    description: "Hunian asri dekat kampus",
    price: 650_000,
    price_harian: 60_000,
  },
  {
    name: "kontrakan 1",
    description: "Hunian keluarga murah",
    price: 1_200_000,
    price_harian: 100_000,
    kontrakan: true,
  },
  {
    name: "kontrakan 2",
    description: "Hunian keluarga murah",
    price: 1_500_000,
    price_harian: 150_000,
    kontrakan: true,
  },
  {
    name: "kontrakan 3",
    description: "Hunian keluarga murah",
    price: 1_000_000,
    price_harian: 100_000,
    kontrakan: true,
  },
].map((items) => ({
  ...items,
  image: [random(linkImageKamar), random(linkImageKamar)],
  id_kos: random(listIdKos),
}));

await KamarKos.deleteMany({});
await KamarKos.insertMany(kamarKosData).catch((e) => {
  console.log(e.message);
});

const penghuni = await Users.findOne({ number_phone: "081234567894" });
const pemilik = await Users.findOne({ number_phone: "081234567890" });
const kamar = await KamarKos.findOne({ name: "kamar 1" }).populate(["id_kos"]);
const kamar2 = await KamarKos.findOne({ name: "kamar 2" }).populate(["id_kos"]);

await Booking.deleteMany({});
const addbooking = async (kamar: any) =>{
  await Booking.create({
    order_id: "order_id_" + Math.round(new Date().getTime() / 1000),
    id_kamar_kos: kamar?._id,
    id_user: penghuni?._id,
    id_admin: pemilik?._id,
    price: 100000,
    method_payment: "manual",
    duration: 30,
    paid_status: 2,
  });

  await KamarKos.findOneAndUpdate({  id_kamar_kos: kamar?._id}, {available: 0})
}

await addbooking(kamar);
await addbooking(kamar2);

const penjaga = await Users.findOne({ number_phone: "081234567891" });

await PenjagaKos.deleteMany({});
const addPenjagaKos = async (kos: any) =>
  await PenjagaKos.create({
    id_kos: kos?.id_kos?._id,
    id_user: penjaga?._id,
  });
await addPenjagaKos(kamar);
// await addPenjagaKos(kamar2);

await mongoose.disconnect();
console.log("finish seeding users, kos, kamar_kos, penghuni, penjaga, booking");
