import mongoose ,{Schema}from "mongoose";

const userSchema=new Schema({
    fullName:{
    type:String,
    required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    incomes: [{
        type: Schema.Types.ObjectId,
        ref: 'Income'
    }],
    budgets: [{
        type: Schema.Types.ObjectId,
        ref: 'Budget'
    }],
    expenses: [{
        type: Schema.Types.ObjectId,
        ref: 'Expense'
    }]
},{timestamps:true})


export const User=mongoose.model("User",userSchema);