import mongoose, { Schema } from "mongoose";

const MONGO_URI = `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DB || 'mydatabase'}`

try {
    mongoose.connect(MONGO_URI, {
        "auth": {
            "username": process.env.MONGO_USER,
            "password": process.env.MONGO_PASSWORD
        },
        "authSource": "admin",
        // "dbName": process.env.MONGO_DB || "mydatabase",
        "timeoutMS": 5000,
        "maxPoolSize": 5,
        "retryWrites": true,
    })
    console.log(`[${process.env.TAG}]: Successfully connnected to MongoDB DataBase!`)
} catch(err) {
    console.error(`[${process.env.TAG}]: MongoDB connection error:`, err)
}