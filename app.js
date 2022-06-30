/** Hovig Ohannessian <hovigg@hotmail.com> **/
// require('dotenv').load('./config/.env');
const MQservice = require('./services/MQservice.js');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

app.use(bodyParser.json());
app.set('port', 5000);

app.get('/',async(req,res)=>{
  res.send("test ok")
});

const queueName = 'SNOW_tickets_UAM_queue';

app.post('/msg',async(req, res, next)=>{
  
  let {  payload } = req.body;
  await MQservice.publishToQueue(queueName, payload);
  res.statusCode = 200;
  res.data = {"message-sent":true};
  res.send("ok");
  // next();
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



app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


