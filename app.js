/** Hovig Ohannessian <hovigg@hotmail.com> **/
// require('dotenv').load('./config/.env');
const MQservice = require('./services/MQservice.js');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

app.use(bodyParser.json());
app.set('port', 5000);

app.get('/test',async(req,res)=>{
  res.send("test ok")
})

app.post('/msg',async(req, res, next)=>{
  const queueName = 'SNOW_tickets_UAM_queue';
  let {  payload } = req.body;
  await MQservice.publishToQueue(queueName, payload);
  res.statusCode = 200;
  res.data = {"message-sent":true};
  res.send("ok");
  // next();
})

app.get('/subscribe', async(req, res)=> {
  let { queueName } = req;
  await subscribefrmQueue(queueName, payload);
  res.statusCode = 200;
  res.data = {"message-sent":true};
  // next();
  res.end();
});



app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


