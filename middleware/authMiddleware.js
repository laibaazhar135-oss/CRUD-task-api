const authService=require('../services/authService');
async function requireAuth(req,res,next) {
    const authHeader=req.headers.authorization;
    const tokenResult= authService.extractBearerToken(authHeader);
    if(tokenResult.error){
        return res.status(401).json({
            error:tokenResult.error
        })
    }
    const verify=await authService.verifyToken(tokenResult.token);
    if(verify.error){
        return res.status(401).json({
            error:verify.error
        })
    }
    req.user=verify.user;
    req.token=tokenResult.token;
    next();
}
module.exports= requireAuth;