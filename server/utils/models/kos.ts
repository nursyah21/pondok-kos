import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    image: {
        type: String,
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Kos = mongoose.model('kos', Schema);
