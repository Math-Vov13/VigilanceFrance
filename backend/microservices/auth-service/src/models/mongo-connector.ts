import mongoose, { Schema } from "mongoose";

const MONGO_URI = `mongodb://${process.env.MONGO_DB_HOST || 'localhost'}:${process.env.MONGO_DB_PORT || '27017'}/${process.env.MONGO_DB_DATABASE || 'mydatabase'}`

try {
    mongoose.connect(MONGO_URI, {
        "auth": {
            "username": process.env.MONGO_DB_USERNAME,
            "password": process.env.MONGO_DB_PSWD
        },
        // "dbName": process.env.MONGO_DB_DATABASE || "mydatabase",
        "timeoutMS": 5000,
        "maxPoolSize": 5,
        "retryWrites": true,
    })
    console.log(`[${process.env.TAG}]: Successfully connnected to MongoDB DataBase!`)
} catch(err) {
    console.error(`[${process.env.TAG}]: MongoDB connection error:`, err)
}