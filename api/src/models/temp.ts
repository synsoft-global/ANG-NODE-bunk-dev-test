import mongoose, { Schema } from 'mongoose';

const tempSchema = new Schema(
    {
        userName: { type: String, },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },

    },
    {
        timestamps: true,
    }
);

const tempModel = mongoose.model('temp', tempSchema);

export default tempModel;
