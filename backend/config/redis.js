const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: "A9uxNGCzailK3d7f13obfdcUJf4qmeXQ",
    socket: {
        host: 'redis-14272.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14272
    }
});

module.exports = redisClient;