const express=require('express');
const router= express.Router();
const asyncHandler=require('../utils/asyncHandler');
const authService=require('../services/authService');

router.get('/public/info',asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:'welcome stranger! This info is public!'
    })
}));
router.get('/protected/profile',asyncHandler(async(req,res)=>{
    const authHeader=req.headers.authorization;
    const tokenResult = authService.extractBearerToken(authHeader);
    if(tokenResult.error){
        return res.status(401).json({
            error: tokenResult.error
        })
    }
    res.status(200).json({
            stage: '2_syntax_check_only',
            message: 'Authorization header is syntactically valid. Cryptographic verification happens in Stage 3.'
    })

}));
module.exports=router;