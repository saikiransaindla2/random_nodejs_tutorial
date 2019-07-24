const EventEmitter = require('events')


class Logger extends EventEmitter{
    log(message){
        //Send an http request + 
        console.log(message);

        //raise an event
        this.emit("message logged", {id:2, url:"http://"})
    }
}
module.exports = Logger