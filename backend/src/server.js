import express from 'express'
import cors from "cors"
import { connectDB } from './config/db.js'
import dotenv from "dotenv"
const app = express()

dotenv.config()

const port = process.env.PORT

app.use(cors())
app.use(express.json())
// app.use("/api/auth",authRoutes)

connectDB().then(() => {
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})})