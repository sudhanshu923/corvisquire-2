import mongoose from "mongoose";

const DB_URI = process.env.MONGO_DB_URI as string
const DB_NAME = "BoraBoraBoraBora"

export async function dbConnect() {

    try {

        await mongoose.connect(DB_URI, { dbName: DB_NAME });

    } catch (error) { throw new Error() }

}