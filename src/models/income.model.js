import mongoose, { Schema } from "mongoose";

const incomeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sourceName: {
        type: String,
        required: true
    },
    monthlyAmount: {
        type: Number,
        required: true
    },
}, { timestamps: true });

export const Income = mongoose.model("Income", incomeSchema);