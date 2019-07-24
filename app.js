const Logger = require('./logger')
const logger = new Logger()

//register a listener
logger.on('message logged', (arg)=>{
    console.log('Listener called', arg);
})

logger.log('HII')