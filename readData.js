const fs=require('fs')
var student

var promise2 =new Promise((resolve,reject)=>{
    fs.readFile('./websites.json', (err, data) => {
        if (err) reject(err);
        student = JSON.parse(data);
        console.log(typeof(student),' size : ', student.length)
        resolve(student)
    });
})

promise2
.then((student)=>{
    for(i=1;i<=student.length;i++)
    {
     client.hmset('urlData:'+i, 'url', student[i-1].url, 'crawlTime', student[i-1].crawlTime, 'waitTime', student[i-1].waitTime, 'threshold', student[i-1].threshold);
    }
    console.log("Everything added")

    for(i=1;i<=student.length;i++)
    {
        client.hgetall('urlData:'+i, function(err,result){
       if(err) {
            console.log(err)
            throw err
        }
        console.log(result)
        })
    }
})
.catch((err)=>console.log(err))            

