require('dotenv').config()
const Redis = require('ioredis')
// var retryStrategy = require("node-redis-retry-strategy");

// const REDIS_USER = process.env.REDIS_USER
const REDIS_REQUIREPASS = process.env.REDIS_REQUIREPASS
const REDIS_IP = process.env.REDIS_IP
const REDIS_PORT = process.env.REDIS_PORT

const redisClient = new Redis({
  port: REDIS_PORT, // Redis port
  host: REDIS_IP, // Redis host
  username: 'default', // needs Redis >= 6
  password: REDIS_REQUIREPASS,
  db: 0, // Defaults to 0
  retryStrategy (times) {
    return Math.min(times * 100, 60 * 1000)
  }
})

// 監聽連線事件
redisClient.on('connect', () => {
  console.log('Redis connected')
})
redisClient.on('ready', async () => {
  console.log(
    `Redis ready in TW timezone : ${new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei'
    })}`
  )
})
redisClient.on('reconnecting', (error) => {
  console.log(
    `Redis Client Reconnect in TW timezone at : ${new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei'
    })}`
  )
  console.log(error)
})
redisClient.on('error', (error) => {
  console.log(
    `Redis Client Error in TW timezone at : ${new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei'
    })}\n`,
    error.message
  )
})

// export redis連線
module.exports = { redisClient }
