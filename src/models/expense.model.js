import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expenseName: {
        type: String,
        required: true
    },
    expenseAmount: {
        type: Number,
        required: true
    },
    expenseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit', 'debit', 'upi', 'other'],
        default: 'cash'
    },
}, { timestamps: true });

export const Expense = mongoose.model("Expense", expenseSchema);