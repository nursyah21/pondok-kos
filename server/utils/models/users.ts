import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
    },
    number_phone: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    id_card: {
        type: String,
    },
    birthdate: {
        type: Date,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

export const Users = mongoose.model('user', Schema);
