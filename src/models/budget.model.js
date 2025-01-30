import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    budgetName: {
        type: String,
        required: true
    },
    budgetAmount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
}, { timestamps: true });

export const Budget = mongoose.model("Budget", budgetSchema);