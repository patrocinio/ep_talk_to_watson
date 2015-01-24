/**
 * Defines an API to invoke the Watson Question and Answer Service running on Bluemix.  
 *
 * This is based on the sample Node.js application provided by IBM at:
 * http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/qaapi/
 *
 * The Watson Question and Answer Service provides to default corpora, healthcare and travel.  
 * This script defines the healthcare corpus as the default, but can easily be changed by 
 * updating the <code>dataset</code> variable.
 */

console.log('Loading watsonapi.js...');

var express = require('express');
var https = require('https');
var url = require('url');
var extend = require('util')._extend;
var api = require('ep_etherpad-lite/node/db/API.js');

var app = express();

// Specifies the number of answers returned from Watson.  Acceptable values are 1-10
var numberOfReturnedAnswers = 1;

// Sets the default dataset to healthcare...keep it simple for this example.
// The other sample Watson corpus is 'travel'
var dataset = 'healthcare';

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");

// Defaults for dev outside bluemix
var watson_url = 'https://gateway.watsonplatform.net/qagw/service';
var watson_username = 'd9227b8c-b31d-45ce-a018-b0f9e2ac6a2c';
var watson_password = 'cKPZJqKE6h2I';

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
function processVCAP_SERVICES()
{
	console.log('****************Start processVCAP_SERVICES*****************************');
	// Service names, check the VCAP_SERVICES in bluemix to get the name of the services you need for this component.
	var watson_service_name = 'question_and_answer';
	
	var services;
	
	// First try to load from the Bluemix VCAP_SERVICES
	if(process.env.VCAP_SERVICES)
	{
		console.log('Loading VCAP_SERVICES from Bluemix...');
		services = JSON.parse(process.env.VCAP_SERVICES);
	}
	// Otherwise, load from VCAP_SERVICES.json configuration file
	else
	{
		console.log('Loading VCAP_SERVICES from VCAP_Services.json');
		services  = require('./VCAP_Services.json');
		// This is the correct way to do it.  If this file is not found the application will not start
		services = require('ep_talk_to_watson/VCAP_Services.json');
	}
	
	if(services[watson_service_name])
	{
		var watsonsvc = services[watson_service_name][0].credentials;
		watson_url = watsonsvc.url;
		watson_username = watsonsvc.username;
		watson_password = watsonsvc.password;
	}
	else 
	{
		console.log('The service ' + watson_service_name + ' is not in the VCAP_SERVICES, did you forget to bind it?');
	}
	
	console.log('waston_url=' + watson_url);
	console.log('watson_usename=' + watson_username);
	console.log('watson_password = ' + new Array(watson_password.length).join("X"));
	console.log('****************End processVCAP_SERVICES*****************************');
}

processVCAP_SERVICES();

var auth = "Basic " + new Buffer(watson_username + ":" + watson_password).toString("base64");

/*
 * Helper function to concisely send Evidence to the console for debugging.
 *
 * @param evidenceList[] - Array of Watson Q&A Evidence objects
 */
function logEvidence( evidenceList )
{
	for(var i = 0; i < evidenceList.length; i++)
	{
		console.log(i + '::' + evidenceList[i].id);
		//console.log(i + '::' + evidenceList[i].text);
	}
}

/**
 * Interface to Watson question-answer service.  The pad provides the ability to identify the correct pad
 * to send the answer to.  The before and after parameters provide the boundaries for placing the answer text
 * into the pad.
 *
 * @param questionText - The question to ask Watson.
 * @param pad - The Etherpad pad object contains the id to correctly insert answer text.
 * @param before - The point in the pad prior to where the answer is typed.
 * @param after - The point in the pad after the question.
 */
exports.askQuestion = function( questionText, pad, before, after )
{
	var parts = url.parse(watson_url + '/v1/question/' + dataset);
	  
	  var options = {
	    host: parts.hostname,
	    port: parts.port,
	    path: parts.pathname,
	    method: 'POST',
	    headers: {
	      'Content-Type'  :'application/json',
	      'Accept':'application/json',
	      'X-synctimeout' : '30',
	      'Authorization' :  auth
	    }
	  };
	  
	  console.log('At line 127...creating Watson request...' );
	  // Create a request to POST to Watson
	  var watson_req = https.request(options, function(result) {
	    result.setEncoding('utf-8');
	    
	    var response_string = '';

	    console.log('At line 134...gathering results from Watson...' );
	    
	    result.on('data', function(chunk) {
	      response_string += chunk;
	    });
	    
	    result.on('end', function() {
		console.log( 'At line 141...answers received...' );

		var answers = JSON.parse(response_string)[0];
		var evidenceList = answers.question.evidencelist;

		logEvidence(evidenceList);

	        // Since we are only returning the text to the first answer, use index 0 or default
		// message to respond.
		var answer = 'Watson is unable to provide an answer.';

		if(evidenceList.length > 0)
		{
			answer = evidenceList[0].text;
		}

		// Change the leading prompt and remove the question mark from the end of the 
		// string so itdoesn't recursively call Watson or provide negative index numbers.
		question = "@watresponded You asked: " + questionText.substr(0, questionText.length -1) + "\n";

		// Since this is an asynchronous call and the api object provides an in context/scope
		// place to insert the answer back on to the pad.
		api.setText(pad.id, before + question + answer + after);
	    });
	  });

	  watson_req.on('error', function(e) {
	    return res.render('index', {'error': e.message});
	  });

	  console.log('At line 171...creating question object for Watson...' );
	  // create the question to Watson
	  var questionData = {
	    'question': {
	      'evidenceRequest': {
	        'items': 1 // the number of supporting passages per answer
	      },
	      'questionText': questionText, // the question
	      'items' : numberOfReturnedAnswers // the number of answers returned
	    }
	  };
	  console.log('At line 182...this is the question being sent to Watson <<< ' + JSON.stringify(questionData) + '>>>');
	  
	  // Set the POST body and send to Watson
	  watson_req.write(JSON.stringify(questionData));
	  watson_req.end();
};
