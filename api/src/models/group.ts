import mongoose, { Schema } from 'mongoose';

const groupSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        currencyId: { type: Schema.Types.ObjectId, ref: "Country" },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        participants: { type: Array },
    },
    {
        timestamps: true,
    }
);

const GroupModel = mongoose.model('Group', groupSchema);

export default GroupModel;
