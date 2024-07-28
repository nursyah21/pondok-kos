import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    type: {
        type: String, //mp4, mp3
        default: 'other'
    },
    size: {
        type: Number
    },
    id_owner: {
        type: String,
        required: true
    }
    
}, { timestamps: true })

export const Files = mongoose.model('files', Schema);
