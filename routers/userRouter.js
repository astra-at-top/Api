const userRouter = require("express").Router()
const {user__post} = require("../controller/userController")
userRouter.route("/").post(user__post)

module.exports = {
    userRouter
}
