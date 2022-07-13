/** Hovig Ohannessian <hovigg@hotmail.com> **/
// require('dotenv').load('./config/.env');
// var fs = require('fs');
const MQservice = require('./services/MQservice.js');
var bodyParser = require('body-parser');
// var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();

app.use(bodyParser.json());
app.set('port', 5005);

app.get('/',async(req,res)=>{
  res.send("test ok")
});

const queueName = 'SNOW_tickets_UAM_queue';

app.post('/msg',async(req, res)=>{
  
  let  payload  = req.body;
  await MQservice.publishToQueue(queueName, payload);
  res.statusCode = 200;
  res.data = {"message-sent":true};
  res.send("ok");

  // next();
})
app.get('/test',async(req,res)=>{
  await MQservice.sampleFun("Hello");
  res.send("ok");
})
app.get('/subscribe', async(req, res)=> {
  // let { queueName } = req;
 await MQservice.subscribefrmQueue(queueName,function(qres){
    // return qres;
    res.statusCode = 200;
    res.send(qres.content.toString());

  });
  
  // res.end();
});

// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(5005);


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


