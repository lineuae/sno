const Snoway = require('./source/structures/client/index')
const keep_alive = require('./keep_alive.js')
const client = new Snoway() 
module.exports = client

process.on("uncaughtException", (e) => {
      if (e.code === 50013) return;
       if (e.code === 50001) return;
       if (e.code === 50035) return;
       if (e.code === 10062) return;
     
       console.log(e)
   })

 if (typeof keep_alive === 'function') {
      keep_alive()
 }

 client.on('error', (e) => {
      console.log(e)
 })

 client.on('shardDisconnect', (event, shardId) => {
      console.log(`[SHARD ${shardId}] disconnect`, event?.code)
 })

 client.on('shardReconnecting', (shardId) => {
      console.log(`[SHARD ${shardId}] reconnecting`)
 })

 client.on('shardError', (error, shardId) => {
      console.log(`[SHARD ${shardId}] error`, error)
 })

 process.on("unhandledRejection", (reason) => {
      console.log(reason)
 })

 process.on("warning", (w) => {
      console.log(w)
 })
