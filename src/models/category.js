import mongoose from 'mongoose'


const { Schema } = mongoose

//2 define the schema
 const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 32,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            
        }
    }
 )

 export default mongoose.model('Category', categorySchema)