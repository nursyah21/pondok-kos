import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxlength: 255
    },
    description: {
        type: String,
        maxlength: 255
    },
    location: {
        type: String,
        maxlength: 255
    },
    image: {
        type: String,
        maxlength: 255
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Kos = mongoose.model('kos', Schema);
