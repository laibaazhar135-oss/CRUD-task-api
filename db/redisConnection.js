require('dotenv').config();
const {createClient}=require('redis');

const redisClient=createClient({url:process.env.REDIS_URL});

redisClient.on('error',(err)=> console.log('redis error',err));//redis an event which throw error in air if you will not catch it the whole node can crash

async function connectRedis(){
     if(!redisClient.isOpen){
        await redisClient.connect();
     }
}
module.exports={redisClient,connectRedis};