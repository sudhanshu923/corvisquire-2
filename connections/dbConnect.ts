import mongoose from "mongoose";

const DB_URI = process.env.MONGO_DB_URI || "mongodb+srv://voltantroyer2:Zkwryp0BeTEG09CA@cluster0.dh6l6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const DB_NAME = process.env.MONGO_DB_NAME || "BoraBora"

export async function dbConnect() {

    try {

        await mongoose.connect(DB_URI, { dbName: DB_NAME });

    } catch (error) { throw new Error() }

}