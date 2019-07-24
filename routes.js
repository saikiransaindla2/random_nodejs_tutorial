const express = require('express')
const isReachable = require('is-reachable');
const myParser = require('body-parser')
const app = express()
const PORT = 8080;
var redis = require('redis');
var client = redis.createClient(); //creates a new client
var promise1 = new Promise((resolve, reject)=>{
    client.on("connect", () => {
        console.log('connected to redis');
        resolve()
    })
    client.on("error",(err)=>{
        console.log('something wrong : '+err)
        reject(err)
    })
})

app.use(myParser.json());
app.use(myParser.urlencoded({ extended: false }));

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

app.get('/:id',(req,res)=>{
    res.send('Get request received '+ req.params.id)
})

app.post('/action',(req,res)=>{
    let student = req.body
    //console.log("hi ",student[0].name, student.length)
    promise1
    .then(()=>{
        let n=1
        client.keys('urlData*',(err,resp)=>{
            let k=resp
            n=k.length

            for(i=1;i<=student.length;i++)
            {
                j=n+i
                client.hmset('urlData:'+j, 'url', student[i-1].url, 'crawlTime', student[i-1].crawlTime, 'waitTime', student[i-1].waitTime, 'threshold', student[i-1].threshold);
            }
            ///Should I add a promise here too??
            console.log("Everything added")
            var ans=[]
            // const pList = []
            // for(i=0; i<10; i++) {
            //     pList.push(new Promise(resolve => {
            //         client.hgetall('urlData:'+i, function(err,result){
            //             if(err) {
            //                 console.log(err)
            //                 throw err
            //             }
                        
            //             // ans.push(result)

            //                 resolve(ans)
            //             // }
            //         })
            //     }))
            // }
            var promise2=new Promise((resolve,reject)=>{
                for(i=n+1;i<=n+student.length;i++)
                {
                     client.hgetall('urlData:'+i, function(err,result){
                        if(err) {
                            console.log(err)
                            throw err
                        }
                        
                        ans.push(result)
                        // console.log(i, result)
                        // if(ans.length==student.length)
                        // {
                            //console.log(ans)
                        console.log("i:", i, student.length)

                        if(ans.length == student.length){
                            console.log("i:", i, ans)
                            resolve(ans)
                        }
                        // }
                    })

                }
                //How to resolve here
                //console.log(ans)
            })
            .then((ans)=>{
                (async () => {    
                    var answer=[]
                    ///Should add one more promise here
                    for( i=0;i<ans.length;i++)
                    {
                        answer.push({url:ans[i].url, health: await isReachable(ans[i].url,{timeout: Number(ans[i].crawlTime)})})
                        //console.log(i, Number(ans[i].crawlTime))
                        if(answer.length == ans.length){
                            //console.log(answer)
                            res.json(answer)
                        }

                    }
                })();
            })
            
            
        })
        
    })
    
    //res.json(req.body)
})