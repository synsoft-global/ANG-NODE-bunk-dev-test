import mongoose, { Schema } from 'mongoose';

const groupdMemberSchema = new Schema(
    {

        users: { type: Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    },
    {
        timestamps: true,
    }
);

const groupModel = mongoose.model('groupMember', groupdMemberSchema);

export default groupModel;
