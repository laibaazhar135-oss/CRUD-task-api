const express=require('express');
const asyncHandler=require('../utils/asyncHandler');
const authService=require('../services/authService');
const { accessToken } = require('../db/supabaseConnection');
const router=express.Router();

router.post('/auth/signup',asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const result= await authService.signup(email,password);
    if(result.error){
       return res.status(400).json({error:result.error});
    }
    res.status(201).json({user: result.user});
}))

router.post('/auth/login',asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const result= await authService.login(email,password);
    if(result.error){
        const status=result.unauthorized?401:400;
        return res.status(status).json({error:result.error})
    }
    res.status(200).json({
        access_token:result.access_token,
        refresh_token: result.refresh_token,
        user: result.user
    });
}))
module.exports = router;

