import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id_user: {
        type: String,
        required: true,
    },
    id_kamar_kos: {
        type: String,
        required: true,
    },
    id_kos: {
        type: String,
        required: true,
    },
    tanggal_bayar: {
        type: Date,
        required: true
    }
}, { timestamps: true })

export const PenghuniKos = mongoose.model('penghuni_kos', Schema);
