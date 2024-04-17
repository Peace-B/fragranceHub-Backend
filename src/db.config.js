import mongoose from 'mongoose';


export const connectDB = (Url) => {
    mongoose
    .connect(Url).then(() => console.log("DB connected Successfully!"))
    .catch((err) => console.log("Error connecting to Mongoose", err.message));
}

