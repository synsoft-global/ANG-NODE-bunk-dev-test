import mongoose, { Schema } from 'mongoose';

const paymentDistributionSchema = new Schema(
    {

        expenseId: { type: Schema.Types.ObjectId, ref: "Expense" },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number },
        noOfUsers: { type: Number }
    },
    {
        timestamps: true,
    }
);

const paymentDistribution = mongoose.model('paymentDistribution', paymentDistributionSchema);

export default paymentDistribution;
