const session = require('express-session');
const redisClient = require('../db/redis');
const RedisStore = require('connect-redis').default;


redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
  });

const sessionHandler = session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false, 
    name:"sessionId",
    cookie: {
        secure: false, // if true: only transmit cookie over https
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 5, // session max age in milliseconds
        sameSite: 'lax' // make sure sameSite is not none
    }
})

module.exports = {sessionHandler}