// function handleAsync (fn) {
//     return (req, res, next) => {
//         fn(req, res).catch(next)
//     }
// }

class errClass extends Error {
    constructor(obj){
        super(obj.msg)
        this.msg = obj.msg
        this.code = obj.code
        this.isCustom = true
        Error.captureStackTrace(this, this.constructor)
    }
}

class customMethodClass {
    handleAsync (fn) {
        return (req, res, next) => {
            fn(req, res).catch(next)
        }
    }

    globalError (err, req, res, next) {
        try{
            console.log(err,"err")
            if(err.isCustom){
                res.status(err.code).json({
                    msg : err.msg,
                    status : "fail"
                })
            }else{
                res.status(400).json({
                    msg : "Something went wrong",
                    status : "fail"
                })
            }
        }catch(err){
            res.status(400).json({
                msg : "Something went wrong",
                status : "fail"
            })
        }
    }
}

module.exports = {
    customMethodClass,
    errClass
}