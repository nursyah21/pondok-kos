import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [125, 'nama maksimal 125 karakter']
    },
    role: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        maxLength: 255
    },
    number_phone: {
        type: String,
        required: true,
        unique: true,
        maxLength: [50, 'nomor whatsapp maksimal 50 karakter']
    },
    avatar: {
        type: String,
        maxLength:255
    },
    id_card: {
        type: String,
        maxLength:255
    },
    birthdate: {
        type: Date,
        default: ''
    },
    address: {
        type: String,
        maxLength: [125, 'alamat maksimal 125 karakter'],        
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

export const Users = mongoose.model('user', Schema);
