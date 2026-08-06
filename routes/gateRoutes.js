const express=require('express');
const router= express.Router();
const asyncHandler=require('../utils/asyncHandler');
const authService=require('../services/authService');
const requireAuth=require('../middleware/authMiddleware');
const { route } = require('./authRoutes');

router.get('/public/info',asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:'welcome stranger! This info is public!'
    })
}));
router.get('/protected/profile',requireAuth,asyncHandler(async(req,res)=>{
       res.status(200).json({user: req.user})
}));

router.get('/protected/dashboard',requireAuth,asyncHandler(async(req,res)=>{
    res.status(200).json({message:`Welcome to your dashboard ${req.user.email}`})
}));

router.post('/auth/logout',requireAuth,asyncHandler(async(req,res)=>{
    const result=await authService.logout(req.token);
    if(result.error){
        return res.status(400).json({
            error:result.error
        })
    }
    res.status(204).send();
}));

module.exports=router;