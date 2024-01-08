import mongoose, { Schema } from 'mongoose';



const countrySchema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        currency: { type: String, },
    },
);

const CountryModel = mongoose.model('Country', countrySchema);

export default CountryModel;
