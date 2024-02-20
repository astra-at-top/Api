const dotenv = require("dotenv").config()
const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const {userRouter} = require("./routers/userRouter")
const {customMethodClass} = require("./utilities/errorHandles")
let globalError = new customMethodClass()
var cookieParser = require('cookie-parser')
const App = Express()
App.use(Express.json())
App.use(Cors())
App.use(cookieParser())
App.use("/signup", userRouter)
App.use(globalError.globalError)
async function main() {
    try{
        let Url = process.env.DATABASE_URL
        let Mongooseconnection = await Mongoose.connect(Url,{
            dbName : "Geekyshow"
        })
        App.listen(process.env.DATABASE_PORT,(err) => {
            if(err) console.log("===fail to startr server===")
            console.log("=== server started ===")
        })
    }catch(err){
        console.log("=== server started ===")
    }
}
main()