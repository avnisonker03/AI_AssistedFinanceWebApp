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
    expenses: [{
        type: Schema.Types.ObjectId,
        ref: 'Expense'
    }]
    // endDate: {
    //     type: Date
    // },
}, { timestamps: true });

budgetSchema.index({ userId: 1, createdAt: -1 });
export const Budget = mongoose.model("Budget", budgetSchema);