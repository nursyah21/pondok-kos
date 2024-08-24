import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: [10_000, 'harga minimal 10rb'],
        max: [10_000_000, 'harga maksimal 10jt']
    },
    id_kamar_kos: {
        type: mongoose.Schema.ObjectId,
        ref: 'kamar_kos',
        required: true,
    },
    id_user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    id_admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    attachment: {
        type: String,
        maxLength:255,
    },
    method_payment: {
        type: String,
        required: true,
        maxLength:255,
    },
    link_payment: {
        type: String,
        maxLength:255,
    },
    order_id: {
        type: String,
        maxLength:255,
    },
    midtrans: {
        type: Object
    },
    duration: {
        type: Number,
        default: 30
    },
    paid_status: {
        type: Number,
        default: 1, //0:fail, 1: is pending, 2: success
    }
}, { timestamps: true })

export const Booking = mongoose.model('booking', Schema);
