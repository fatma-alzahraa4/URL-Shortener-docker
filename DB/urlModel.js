import { model, Schema } from "mongoose";

const URLSchema = new Schema({
    originalURL: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: Date, // optional,
    isActive:{
        type:Boolean,
        default:true,
        required:true
    }
},
    { timestamps: true }
)

export const URLModel = model('URL', URLSchema)