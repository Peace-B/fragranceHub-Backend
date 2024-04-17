import mongoose from 'mongoose'
import { Schema } from "mongoose";

//2 define the schema
 const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            min: 6,
            max: 30
        },
        image: {
            type: String,
             
        }, 
        imagePublicId: {
            type: String,

        }, 
        role: {
            type: Number,
            default: 0,
        },
        address: {
            type: Object,
            default: {
                street: 'No 25 Alfa Nda  street',
                city: 'mushin',
                state: 'Lagos',
                country: 'Nigeria',
                zip: '12345'
            }
        }, 

    },
    {timestamps: true }
);

export default mongoose.model('User', userSchema)