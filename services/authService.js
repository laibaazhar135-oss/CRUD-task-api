const supabase=require('../db/supabaseConnection');

function toSafeuser(user){
    return {
        id:user.id,
        email:user.email,
        created_at:user.created_at
    }
}

async function signup(email,password) {
    if(typeof email !== 'string'|| email.trim().length===0){
        return {error: 'invalid or missing email!'}
    }
    if(typeof password!=='string'||password.length<6){
        return {error:'Password is required and must be 6 characters long!'}
    }
    const {data,error}=await supabase.auth.signUp({
       email: email.trim(),
       password:password
});
    if(error){
        console.log('signup error',error.message);
        
        return {error:'Could not create account.Please check your details then try'}
    }
    return {
        user:toSafeuser(data.user)
    }
}

async function login(email,password) {
     if(typeof email!=='string'||email.trim().length===0){
        return {error: 'invalid or missing email!'}
    }
    if(typeof password!=='string'||password.length<6){
        return {error:'Password is required and must be 6 characters long!'}
    }
    const {data,error}=await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
});
    if(error){
        return {error:'Invalid credentials',unauthorized:true}
    }
    return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: toSafeuser(data.user)
    }
}
function extractBearerToken(authHeader){
   if(!authHeader){
    return {error:'Access token required'}
   }
   const parts=authHeader.split(' ');
   if(parts.length!==2){
    return {error:'Access token required'}
   }
   const scheme=parts[0];
   const token=parts[1];
   if(scheme.toLowerCase()!=='bearer'){
    return {error:'Access token required'}
   }
   if(!token||token.length===0){
    return {error: 'Access token required'}
   }
   return {token:token}
}

async function verifyToken(token) {
    const {data,error} = await supabase.auth.getUser(token);
    if(error){
        console.error('invalid token',error.message)
        return {error:'Invalid or expired token'}
    }
    return {user: toSafeuser(data.user)}
}

async function logout(token, scope = 'local') {
    const {error}=await supabase.auth.admin.signOut(token,scope);
    console.log('ADMIN SIGNOUT ERROR:', error);
    if(error){
        console.error('Logout error',error.message)
        return {error:'Could not logout'}
    }
    return {success:true}
}

module.exports={toSafeuser,signup,login,extractBearerToken,verifyToken,logout};