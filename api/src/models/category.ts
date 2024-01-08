import mongoose, { Schema } from 'mongoose';


const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, },
    },
    {
        timestamps: true,
    }
);

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;
