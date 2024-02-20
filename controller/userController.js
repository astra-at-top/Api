const userSchema = require("../modles/userSchema")
const userModle = require("../modles/userSchema")
const {customMethodClass,errClass} = require("../utilities/errorHandles")
const jwt = require("jsonwebtoken")
let handleError = new customMethodClass()

function createToken (obj) {
    return jwt.sign({
        id : obj.id
    }, process.env.SECRET_KEY,{
        expiresIn: '1d'
    })
}

module.exports = {
    user__post : handleError.handleAsync(async (req, res) => {
        let {name,email,password,confirmPassword,tc} = req.body 
        if(password === confirmPassword){
                let user = await userModle.findOne({
                    email : email
                })
                if(!user){
                    let newUser = await userModle.create({
                        name : name,
                        email : email,
                        password  : password,
                        tc : tc
                    })
                    if(newUser){
                        
                        res.status(200).json({
                            msg : "Successfull created user",
                            status : "success"
                        })
                    }
                }else{
                    let data = {
                        msg : "User already exist",
                        code : 400
                    }
                    throw new errClass(data)
                }
            
        }else{
            let data = {
                msg : "Confirm password  does not match",
                code : 400
            }
            throw new errClass(data)
        }
    }),
    login__post : handleError.handleAsync(async(req, res) => {
        let {email, password} = req.body
        let user = await userModle.findOne({
            email : email
        }).select("+password")

        if(user !== null){
            if(userSchema.comparePassword({
                userPassword : password,
                encryptedpass : user.password
            })){
                res.cookie(jwt,createToken({
                    id : user._id
                }), { maxAge: 24 * 60 * 60 * 1000 });
                res.status(200).json({
                    msg : "User successfully logged in",
                    status : "success"
                })
            }else{
                let data = {
                    msg : "Please enter valid credentials",
                    code : 400
                }
                throw new errClass(data)
            }
        }else{
            let data = {
                msg : "Please enter valid credentials",
                code : 400
            }
            throw new errClass(data)
        }

    })
}