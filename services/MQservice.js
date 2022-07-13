var amqp = require('amqplib/callback_api');
var https = require("https");
var path = require("path");
var request = require('request');
const axios = require('axios').default;

// const CONN_URL = "amqp://default_user_ktT-qCwbyR1Wy8joWly:sBMNyDEz-FIf4Dh8qKbUmyErUcprDjTB@localhost:5671";
// const CONN_URL = "amqp://default_user_cgJHk2Gn5Yu29iNwW0V:n86T02EK6lkPW-pH9hWxBnvx_p8MS_0w@rabbitmq-dev-deploy.dw-cp4ba.svc.cluster.local:5672";
const CONN_URL = "amqp://default_user_ktT-qCwbyR1Wy8joWly:sBMNyDEz-FIf4Dh8qKbUmyErUcprDjTB@instance-server.dw-cp4ba.svc.cluster.local:5672";

let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
	if (err) {
		console.log("=========Error in queue connection==");
		console.log(err);
        throw(err);
		// return callback(err)
	}
   conn.createChannel(function (err, channel) {
      ch = channel;
	  ch.assertQueue("SNOW_tickets_UAM_queue",{durable:true});
   });
});

exports.publishToQueue = async (queueName, data) => {
	// ch.assertQueue(queueName,{durable:true})
	ch.sendToQueue(queueName,  Buffer.from(JSON.stringify(data)),{persistent: true});
	subscribefrmQueue((queueName))
 }

const subscribefrmQueue = async(queueName)=>{
	ch.consume(queueName, function (msg) {
		console.log('.....',msg);
		invokeWorkflw(msg,(req)=>{return req});
		},{ noAck: true }
	  );
} 
// exports.sampleFun = async(msg)=>{
	// var option = {
	// 	url:"https://cpd-cp4ba.itzroks-662002t4vm-m1086h-4b4a324f027aea19c5cbc0c3275c4656-0000.us-east.containers.appdomain.cloud/bas/automationservices/rest/SA/REST%20Service_UAM/consumer",
	// 	method: 'post',
	// 	headers: {
	// 		"Authorization" : "Basic Y3A0YWRtaW46c1RIbGx4TDM3WnRFUklWUk1EdmM=",
	// 	// 	"Authorization" :"Bearer 00D5g000004zzrb!ARkAQKNzHDhb2o4rf5WeEUeN6JbXFNpek7_2QsjZdQRwF4OSkaErqHXaiCi626QigI5fGORlOI5mtKkii2KEqNCOYmw8xFjs",
	// 		"Content-Type":"application/json"
	// 	   },
	// 	data: msg 
	//   };
	// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// axios({
// 	url:"https://cpd-cp4ba.itzroks-662002t4vm-m1086h-4b4a324f027aea19c5cbc0c3275c4656-0000.us-east.containers.appdomain.cloud/bas/automationservices/rest/SA/REST%20Service_UAM/consumer",
// 	method: 'post',
// 	headers: {
// 		"Authorization" : "Basic Y3A0YWRtaW46c1RIbGx4TDM3WnRFUklWUk1EdmM=",
// 		"Content-Type":"application/json"
// 	   },
// 	data: msg 
//   })
// .then(res => {
//   console.log(`statusCode: ${res.status}`)
//   console.log(res)
// })
// .catch(error => {
//   console.error(error)
// })
// }

const invokeWorkflw = async(msg,callback)=>{
	var option = {
		hostname: 'https://cpd-cp4ba.itzroks-662002t4vm-m1086h-4b4a324f027aea19c5cbc0c3275c4656-0000.us-east.containers.appdomain.cloud/bas/automationservices/rest/SA/REST%20Service_UAM',
		// port: 5005,
		path: '/consumer',
		method: 'POST',
		headers: {
			"Authorization" : "Basic Y3A0YWRtaW46c1RIbGx4TDM3WnRFUklWUk1EdmM=",
			"Content-Type":"application/json"
		   }
	  };
	  
	  var invokerequest = https.request(option, function(response) {
		console.log("CREATE RESPONSE : ",response);
		var data = '';
		response.on("data", function(chunk) {
			data += chunk;
		});
				 
		response.on("end",function() {
			console.log("Response Status :",response.statusCode)
			
			if (response.statusCode==200 || response.statusCode == 201 || response.statusCode == 204){
					callback(null,data);
			}else{
				callback("Error in calling "+target_path);
			}
		 
		})
			
	}).on("error", function(e) {
		console.log("error message: " + e.message);
		//res.send(e.message);
		callback(e)
	});
	  
	invokerequest.write(msg);
	invokerequest.end();
}


// axios.get("https://www.crstn.org/birth_death_tn/PubBirthCertReport.jsp")
// .then((res)=>{
// 	console.log(res);
// })


 process.on('exit', (code) => {
	ch.close();
	console.log(`Closing rabbitmq channel`);
 });