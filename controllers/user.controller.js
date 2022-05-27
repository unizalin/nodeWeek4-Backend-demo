const { successHandler, errorHandler } = require('../server/handle');
const User = require('../models/user.model');
const handleErrorAsync = require("../server/handleErrorAsync")
const appError = require("../server/appError")

exports.create = handleErrorAsync(async(req,res,next)=>{
    const {name,email,gender,photo} = req.body
    const data = {name,email,gender,photo}
    
    if(!data.name|| !data.email){
      return next(appError(400,"姓名跟E-mail需要填寫",next))
    }

    const newUser = await User.create(data)
    successHandler(res,'success',newUser)

})

exports.findAll = handleErrorAsync( async(req,res,next)=>{
    const allUser = await User.find()
    successHandler(res,'success',allUser)
})

exports.findOne = handleErrorAsync(async(req,res,next)=>{
      const userId = req.params.id
      const userItem = await User.findById(userId).exec()
      if(!userItem){
        return next(appError(400,"查無此ID",next))
      }
        successHandler(res,'success',userItem)
})

exports.deleteAll = handleErrorAsync(async(req,res,next)=>{
    await User.deleteMany({});
    successHandler(res,'success')
})

exports.deleteOne = handleErrorAsync(async(req,res,next)=>{
    const userId = req.params.id
    const delUser = await User.findByIdAndDelete(userId);
    if(!delUser){
      return next(appError(400,"查無此ID",next))
    }
    successHandler(res,'刪除成功')
})

exports.updateUser = handleErrorAsync(async(req,res,next)=>{
  const {name,email,gender,photo} = req.body
  const data = {name,email,gender,photo}
  const userId = req.params.id
  const user = await User.findById(userId).exec();
  if(!user){
    return next(appError(400,"查無此ID，無法變更資料",next))
  }
  if(!data.name|| !data.email){
    return next(appError(400,"姓名跟E-mail不能為空",next))
  }
  const updateUser = await User.findByIdAndUpdate(userId,data);
  if(!updateUser){
    return next(appError(400,"查無此ID",next))
  }
  const resultUser =await User.findById(userId).exec();
  successHandler(res,'success',resultUser)
})