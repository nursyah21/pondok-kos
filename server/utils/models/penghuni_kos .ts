import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    id_kamar_kos: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    id_kos: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    tanggal_bayar: {
        type: Date,
        required: true
    }
}, { timestamps: true })

export const PenghuniKos = mongoose.model('penghuni_kos', Schema);
