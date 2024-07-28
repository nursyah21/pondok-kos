import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    id_kamar_kos: {
        type: String,
        required: true,
    },
    id_user: {
        type: String,
        required: true,
    },
    id_admin: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
    },
    method_payment: {
        type: String,
        required: true,
    },
    link_payment: {
        type: String,
    },
    order_id: {
        type: String
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
