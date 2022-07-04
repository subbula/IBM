var amqp2 = require('amqplib');

var amqp = require('amqplib/callback_api');

const CONN_URL = "amqp://default_user_cgJHk2Gn5Yu29iNwW0V:n86T02EK6lkPW-pH9hWxBnvx_p8MS_0w@rabbitmq-dev-deploy.dw-cp4ba.svc.cluster.local:5672";
// const CONN_URL = "amqp://default_user_cgJHk2Gn5Yu29iNwW0V:n86T02EK6lkPW-pH9hWxBnvx_p8MS_0w@localhost:5671";

let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
	if (err) {
		console.log("=========Error in queue connection==")
		console.log(err)
		// return callback(err)
	}
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});

exports.publishToQueue = async (queueName, data,callback) => {
	ch.sendToQueue(queueName,  Buffer.from(JSON.stringify(data)),{persistent: true});
	// callback(null,{"200":"ok"})
 }

exports.subscribefrmQueue = async(queueName,callback)=>{
	ch.consume(queueName, function (msg) {
		console.log('.....',msg);
		callback(msg)
		},{ noAck: true }
	  );
} 
 process.on('exit', (code) => {
	ch.close();
	console.log(`Closing rabbitmq channel`);
 });
