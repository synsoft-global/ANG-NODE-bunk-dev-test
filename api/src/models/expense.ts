import mongoose, { Schema } from 'mongoose';

const expenseSchema = new Schema(
    {
        title: { type: String },
        amount: { type: Number },
        paidBy: { type: Schema.Types.ObjectId, ref: "User" },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
        image: { type: String },
        paidAt: { type: Date },
        users: { type: Array }

    },
    {
        timestamps: true,
    }
);

const expenseModel = mongoose.model('expense', expenseSchema);

export default expenseModel;
