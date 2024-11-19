import express from "express"
import dbConnection from "./db/conn.js"


dbConnection()
const app = express()
const port = 5000

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(port,()=>{
console.log(`server is running on port http://localhost:${port}`)
})