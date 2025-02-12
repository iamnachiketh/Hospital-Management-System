import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log("Database has been connected"))
    .catch((error: any) => console.log(error));
}