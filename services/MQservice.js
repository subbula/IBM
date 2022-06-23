var amqp2 = require('amqplib');

var amqp = require('amqplib/callback_api');

const CONN_URL = "amqp://default_user_q6ES30Clry-6X3V7Lwy:kRULI4o-cuwM86NUwfo8_jFPkDO1cI4G@172.30.253.152:5672";

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
	ch.sendToQueue(queueName,  Buffer.from(data),{persistent: true});
	// callback(null,{"200":"ok"})
 }

exports.subscribefrmQueue = async(queueName,callback)=>{
	ch.consume(queueName, function (msg) {
		console.log('.....');
		callback(null,msg)
		},{ noAck: true }
	  );
} 
 process.on('exit', (code) => {
	ch.close();
	console.log(`Closing rabbitmq channel`);
 });
