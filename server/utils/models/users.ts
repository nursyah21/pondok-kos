import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength:255
    },
    role: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        maxlength:255
    },
    number_phone: {
        type: String,
        required: true,
        unique: true,
        maxlength:255
    },
    avatar: {
        type: String,
        maxlength:255
    },
    id_card: {
        type: String,
        maxlength:255
    },
    birthdate: {
        type: Date,
        default: ''
    },
    address: {
        type: String,
        maxlength:255,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

export const Users = mongoose.model('user', Schema);
